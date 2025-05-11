import json
import tiktoken
from openai import OpenAI
from abc import abstractmethod
from typing import List, AsyncGenerator
from chat.agent.tools import ToolInterface
from chat.agent.chat_history import ChatHistory
from chat.agent.token_usage_manager import TokenUsageManager

token_usage_manager = TokenUsageManager()
gpt_4o_mini_token_encoding = tiktoken.encoding_for_model("gpt-4o-mini")


class AgentInterface:
    @abstractmethod
    def add_tool(self, tool: ToolInterface):
        """
        The method for adding one tool to agent tool list.

        Parameters:
            tool (ToolInterface): tool with additional functionality
        """
        pass

    @abstractmethod
    def add_tools(self, tool: List[ToolInterface]):
        """
        The method for adding many tools to agent tool list.

        Parameters:
            tools (List[ToolInterface]): list of tools with additional functionalities
        """
        pass

    @abstractmethod
    def ask(self, question: str):
        """
        The method to ask agent a question. Agent will add question
        to chat history and invoke question to OpenAI API.

        Parameters:
            question (str): a question in text
        """
        pass


class AgentBase(AgentInterface):
    def __init__(self, client: OpenAI, chat_history: ChatHistory, model: str="gpt-4o-mini"):
        self._client = client
        self._chat_history = chat_history
        self._model = model
        self._tools = []
        self._tools_descriptions = []

    def add_tool(self, tool):
        self._tools.append(tool)
        self._tools_descriptions.append(tool.description)

    def add_tools(self, tools: list):
        for tool in tools:
            self._tools.append(tool)
            self._tools_descriptions.append(tool.description)

    async def _call_function(self, name, chat_id, args):
        for tool in self._tools:
            if tool.name == name:
                return await tool.use(**args, chat_id=chat_id)


class Agent(AgentBase):
    async def ask(self, question: str, chat_id: str) -> AsyncGenerator[str, None]:
        """
        The method to ask agent a question. Agent will add question
        to chat history and invoke question to OpenAI API.

        Parameters:
            question (str): a question in text
            chat_id (str): chat id to get access to chat history
        """
        # 1. Add new message to database
        message = {"role": "user", "content": question}
        self._chat_history.add_new_message(chat_id, message)

        async for chunk in self.__process_question(chat_id):
            yield json.dumps(chunk)

    async def ask_quietly(self, chat_id: str) -> AsyncGenerator[str, None]:
        """
        The method to ask agent a question. Agent invoke question to
        OpenAI API without adding question to database.

        Parameters:
            chat_id (str): chat id to get access to chat history
        """
        async for chunk in self.__process_question(chat_id):
            yield json.dumps(chunk)

    async def __process_question(self, chat_id: str) -> AsyncGenerator[str, None]:
        # 2. Invoke OpenAi API (make decision which tool use)
        completion = await self._client.chat.completions.create(
            model=self._model,
            messages=self._chat_history.get_chat_history_for_agent(chat_id),
            tools=self._tools_descriptions
        )
        await token_usage_manager.add_used_tokens(chat_id, completion.usage.total_tokens)
        completion = completion.model_dump()

        # 3. Collect related sources
        related_sources = []

        self._chat_history.add_new_message(chat_id, completion["choices"][0]["message"])
        tool_calls = completion["choices"][0]["message"]["tool_calls"]
        tool_calls = [] if tool_calls is None else tool_calls

        for tool_call in tool_calls:
            name = tool_call["function"]["name"]
            args = json.loads(tool_call["function"]["arguments"])
            result = await self._call_function(name, chat_id, args)
            
            if name == "KnowledgeBaseTool":
                for metadata in result["metadata"]:
                    source = {}
                    
                    if "source" in metadata:
                        source["source"] = metadata["source"]
                    if "title" in metadata:
                        source["title"] = metadata["title"]

                    if "source" in source:
                        related_sources.append(source)

                message = {
                    "role": "tool",
                    "name": name,
                    "tool_call_id": tool_call["id"],
                    "content": json.dumps(result["content"]),
                    "metadata": json.dumps(result["metadata"])
                }

                self._chat_history.add_new_message(chat_id, message)

        # 4. Final prompt
        completion_stream = await self._client.chat.completions.create(
            model=self._model,
            temperature=0,
            messages=self._chat_history.get_chat_history_for_agent(chat_id),
            stream=True
        )

        # 5. Stream output
        collected_messages = []

        async for chunk in completion_stream:
            chunk_message = chunk.choices[0].delta.content
            collected_messages.append(chunk_message)

            if chunk_message is None:
                continue

            yield {"chunk": chunk_message}

        yield {"sources": related_sources}

        # 6. Add output to chat history
        collected_messages = [m for m in collected_messages if m is not None]
        final_response = ''.join(collected_messages)
        message = {"role": "assistant", "content": final_response}
        self._chat_history.add_new_message(chat_id, message)

        await token_usage_manager.add_used_tokens(
            chat_id,
            len(gpt_4o_mini_token_encoding.encode(final_response))
        )
