import json
import tiktoken
from openai import AsyncOpenAI
from abc import abstractmethod
from typing import List, AsyncGenerator
from chat.agent.tools import ToolInterface
from chat.agent.chat_history import ChatHistory
from chat.agent.token_usage_manager import TokenUsageManager
from chat.agent.prompt_injection import PromptInjection


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

    async def _call_function(self, name, chat_id, args):
        for tool in self._tools:
            if tool.name == name:
                return await tool.use(**args, chat_id=chat_id)


class Agent(AgentBase):
    def __init__(self, model = "gpt-4o-mini", system_prompt = None):
        super().__init__(model, system_prompt)
        if system_prompt is None:
            self._system_prompt = "You are helpfull assistant, who help students with administrative problems."
        self._client = AsyncOpenAI()
        self._token_usage_manager = TokenUsageManager()
        self._gpt_4o_mini_token_encoding = tiktoken.encoding_for_model(self.model)

    async def ask(self, question: str, chat_id: str) -> AsyncGenerator[str, None]:
        self._chat_history.add_new_message(
            chat_id,
            {"role": "user", "content": question}
        )

        async for chunk in self.__process_question(chat_id):
            yield json.dumps(chunk)

    async def ask_quietly(self, chat_id: str) -> AsyncGenerator[str, None]:
        async for chunk in self.__process_question(chat_id):
            yield json.dumps(chunk)

    async def __process_question(self, chat_id: str) -> AsyncGenerator[str, None]:
        question = self._chat_history.get_chat_last_message(chat_id)
        messages_for_final = [
            {"role": "system", "content": self._system_prompt},
            {"role": "user", "content": question}
        ]
        related_sources = []

        # Detect prompt injection
        is_prompt_injection = self._prompt_injection.detect(question)

        if is_prompt_injection:
            self._chat_history.flag_last_message_as_prompt_injection(chat_id)
            yield {
                "error": {
                    "type": "prompt_injection",
                    "content": self._prompt_injection.get_message()
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
        self._token_usage_manager.add_used_tokens(chat_id, tool_selection_completion.usage.total_tokens)
        tool_selection_completion = tool_selection_completion.model_dump()
        tool_calls = tool_selection_completion["choices"][0]["message"]["tool_calls"]
        tool_calls = [] if tool_calls is None else tool_calls

        # Use tools
        for tool_call in tool_calls:
            name = tool_call["function"]["name"]
            args = json.loads(tool_call["function"]["arguments"])
            result = await self._call_function(name, chat_id, args)

            message = {}
            message.setdefault("role", "tool")
            message.setdefault("content", result["content"])

            for key, value in result.get("metadatas", {}).items():
                if key == "source":
                    related_sources.append(value)

            messages_for_final.append(message)

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
            chunk_message = chunk.choices[0].delta.content
            collected_messages.append(chunk_message)

            if chunk_message is None:
                continue

            yield {"chunk": chunk_message}

        yield {"sources": related_sources}

        # Save answer
        collected_messages = [m for m in collected_messages if m is not None]
        final_response = ''.join(collected_messages)
        message = {"role": "assistant", "content": final_response}
        self._chat_history.add_new_message(chat_id, message)

        self._token_usage_manager.add_used_tokens(
            chat_id,
            len(self._gpt_4o_mini_token_encoding.encode(final_response))
        )
