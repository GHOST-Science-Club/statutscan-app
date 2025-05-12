import json
import tiktoken
from openai import OpenAI
from abc import abstractmethod
from typing import List, AsyncGenerator
from chat.agent.tools import ToolInterface
from chat.agent.chat_history import ChatHistory
from chat.agent.token_usage_manager import TokenUsageManager
from asgiref.sync import sync_to_async

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
        message = {"role": "user", "content": question}
        await sync_to_async(self._chat_history.add_new_message, thread_sensitive=True)(
            chat_id,
            message
        )

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
        history = await sync_to_async(
            self._chat_history.get_chat_history_for_agent,
            thread_sensitive=True
        )(chat_id)

        completion: ChatCompletion = await self._client.chat.completions.create(
            model=self._model,
            messages=history,
            tools=self._tools_descriptions,
        )

        await sync_to_async(
            token_usage_manager.add_used_tokens,
            thread_sensitive=True
        )(chat_id, completion.usage.total_tokens)

        first_choice = completion.choices[0]
        first_msg = first_choice.message
        first_msg_dict = (
            first_msg.model_dump()
            if hasattr(first_msg, "model_dump")
            else first_msg.dict()
        )
        await sync_to_async(
            self._chat_history.add_new_message,
            thread_sensitive=True
        )(chat_id, first_msg_dict)

        related_sources = []
        tool_calls = first_msg.tool_calls or []
        for call in tool_calls:
            name = call.function.name
            args = json.loads(call.function.arguments)
            result = await self._call_function(name, chat_id, args)


            if name == "KnowledgeBaseTool":
                for meta in result["metadata"]:
                    src = {}
                    if "source" in meta:
                        src["source"] = meta["source"]
                    if "title" in meta:
                        src["title"] = meta["title"]
                    if src:
                        related_sources.append(src)

                tool_msg = {
                    "role": "tool",
                    "name": name,
                    "tool_call_id": call.id,
                    "content": json.dumps(result["content"]),
                    "metadata": json.dumps(result["metadata"]),
                }
                await sync_to_async(
                    self._chat_history.add_new_message,
                    thread_sensitive=True
                )(chat_id, tool_msg)

        stream = await self._client.chat.completions.create(
            model=self._model,
            temperature=0,
            messages=await sync_to_async(
                self._chat_history.get_chat_history_for_agent,
                thread_sensitive=True
            )(chat_id),
            stream=True,
        )

        collected = []
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                collected.append(delta)
                yield {"chunk": delta}

        yield {"sources": related_sources}

        full = "".join(collected)
        final_msg = {"role": "assistant", "content": full}
        await sync_to_async(
            self._chat_history.add_new_message,
            thread_sensitive=True
        )(chat_id, final_msg)

        await sync_to_async(
            token_usage_manager.add_used_tokens,
            thread_sensitive=True
        )(chat_id, len(gpt_4o_mini_token_encoding.encode(full)))