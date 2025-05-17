import json
import tiktoken
from openai import AsyncOpenAI
from abc import abstractmethod
from typing import List, AsyncGenerator
import asyncio
from chat.agent.tools.interface import ToolInterface
from chat.agent.chat_history import ChatHistory
from chat.agent.token_usage_manager import TokenUsageManager
from chat.agent.prompt_injection import PromptInjection
from asgiref.sync import sync_to_async


class AgentInterface:
    @abstractmethod
    def add_tool(self, tool: ToolInterface):
        """
        The method for adding one tool to agent tool list.

        Args:
            tool (ToolInterface): tool with additional functionality
        """
        pass

    @abstractmethod
    def add_tools(self, tool: List[ToolInterface]):
        """
        The method for adding many tools to agent tool list.

        Args:
            tools (List[ToolInterface]): list of tools with additional functionalities
        """
        pass

    @abstractmethod
    def ask(self, question: str):
        """
        The method to ask agent a question. Agent will add question
        to chat history and invoke question to OpenAI API.

        Args:
            question (str): a question in text
        """
        pass


class AgentBase(AgentInterface):
    def __init__(self, model: str="gpt-4o-mini", system_prompt: str=None):
        self._client = None
        self._model = model
        self._system_prompt = system_prompt
        self._chat_history = ChatHistory()
        self._prompt_injection = PromptInjection()
        self._tools = []
        self._tools_descriptions = []

    def add_tool(self, tool):
        self._tools.append(tool)
        self._tools_descriptions.append(tool.description)

    def add_tools(self, tools: list):
        for tool in tools:
            self._tools.append(tool)
            self._tools_descriptions.append(tool.description)


class Agent(AgentBase):
    def __init__(self, model: str = "gpt-4o-mini", system_prompt: str = None):
        super().__init__(model, system_prompt)
        if system_prompt is None:
            self._system_prompt = "You are helpfull assistant, who help students with administrative problems."
        self._client = AsyncOpenAI()
        self._token_usage_manager = TokenUsageManager()
        self._gpt_4o_mini_token_encoding = tiktoken.encoding_for_model(self._model)

    async def _call_tool(self, name, chat_id, args):
        for tool in self._tools:
            if tool.name == name:
                return await tool.use(**args, chat_id=chat_id)
            
    async def _call_tools(self, tool_calls: List, chat_id: str):
        tool_function_calls = []
        ids = []
        for tool_call in tool_calls:
            name = tool_call["function"]["name"]
            args = json.loads(tool_call["function"]["arguments"])
            id = tool_call["id"]
            tool_function_calls.append(self._call_tool(name, chat_id, args))
            ids.append(id)

        results = await asyncio.gather(*tool_function_calls)
        return [
            {"result": result, "id": id}
            for result, id in zip(results, ids)
        ]

    async def ask(self, question: str, chat_id: str) -> AsyncGenerator[str, None]:
        """
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
        async for chunk in self.__process_question(chat_id):
            yield json.dumps(chunk)

    async def __process_question(self, chat_id: str) -> AsyncGenerator[str, None]:
        question = await sync_to_async(
            self._chat_history.get_chat_last_message,
            thread_sensitive=True
        )(chat_id)
        question = question["content"]
        messages_for_final = [
            {"role": "system", "content": self._system_prompt},
            {"role": "user", "content": question}
        ]
        related_sources = []

        # Detect prompt injection
        result = await self._prompt_injection.detect(question)

        if result.get("is_prompt_injection"):
            await sync_to_async(
                self._chat_history.flag_last_message_as_prompt_injection,
                thread_sensitive=True
            )(chat_id)
            yield {
                "error": {
                    "type": "prompt_injection",
                    "content": result.get("message")
                }
            }
            return

        # Select tools to use
        tool_selection_completion = await self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": self._system_prompt},
                {"role": "user", "content": question}
            ],
            tools=self._tools_descriptions,
            tool_choice="auto"
        )
        await sync_to_async(
            self._token_usage_manager.add_used_tokens,
            thread_sensitive=True
        )(chat_id, tool_selection_completion.usage.total_tokens)
        tool_selection_completion = tool_selection_completion.model_dump()
        tool_calls = tool_selection_completion["choices"][0]["message"]["tool_calls"]
        tool_calls = [] if tool_calls is None else tool_calls

        # Use tools
        tool_messages = []
        tool_calls_message = {
            "role": "assistant",
            "tool_calls": []
        }
        results = await self._call_tools(tool_calls, chat_id)
        for i, result in enumerate(results):
            if "metadatas" in result["result"] and\
               "no_answer" in result["result"]["metadatas"] and\
                result["result"]["metadatas"]["no_answer"]:
                continue

            message = {
                "role": "tool",
                "tool_call_id": result["id"],
                "content": result["result"]["content"]
            }

            if "metadatas" in result and "sources" in result["metadatas"]:
                for source_metadata in result["metadatas"]["sources"]:
                    if "source" in source_metadata:
                        related_sources.append(source_metadata["source"])

            tool_messages.append(message)
            tool_calls_message["tool_calls"].append(tool_calls[i])
            
        if len(tool_calls_message["tool_calls"]) > 0:
            messages_for_final.append(tool_calls_message)
        if len(tool_messages) > 0:
            messages_for_final.extend(tool_messages)

        # Final prompt
        stream_completion = await self._client.chat.completions.create(
            model=self._model,
            temperature=0.7,
            messages=messages_for_final,
            stream=True
        )

        # Stream answer
        collected_messages = []

        async for chunk in stream_completion:
            delta = chunk.choices[0].delta.content
            if delta:
                collected_messages.append(delta)
                yield {"chunk": delta}

        if related_sources:
            yield {"sources": related_sources}

        # Save answer
        full = ''.join(collected_messages)
        final_msg = {"role": "assistant", "content": full}
        await sync_to_async(
            self._chat_history.add_new_message,
            thread_sensitive=True
        )(chat_id, final_msg)

        await sync_to_async(
            self._token_usage_manager.add_used_tokens,
            thread_sensitive=True
        )(chat_id, len(self._gpt_4o_mini_token_encoding.encode(full)))
