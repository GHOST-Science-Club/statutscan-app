from typing import Dict
from openai import AsyncOpenAI
from chat.agent.tools import ToolInterface
from chat.agent.chat_history import ChatHistory
from chat.agent.token_usage_manager import TokenUsageManager


class ChatHistoryTool(ToolInterface):
    def __init__(self, n_last_messages: int=5, model: str="gpt-4o-mini", max_output_tokens: int=200):
        self.n_last_messages = n_last_messages
        self.model = model
        self.max_output_tokens = max_output_tokens
        self._openai_client = AsyncOpenAI()
        self._chat_history = ChatHistory()
        self._token_usage_manager = TokenUsageManager()
        self._tool_system_prompt = (
            "You are a helpful assistant whose job is to summarize the history of time "
            "extracting the information needed to answer the user's question"
        )

    async def use(self, question: str, chat_id: str):
        history = self._chat_history.get_chat_n_last_messages(chat_id, self.n_last_messages)
        messages = [
            {"role": "system", "content": self._tool_system_prompt},
            {"role": "user", "content": f"User question: {question}"},
            *history
        ]
        response = await self._openai_client.ChatCompletion.acreate(
            model=self.model,
            messages=messages,
            temperature=0.5,
            max_tokens=self.max_output_tokens
        )
        self._token_usage_manager.add_used_tokens(chat_id, response.usage.total_tokens)
        result = {
            "content": response.choices[0].message["content"]
        }
        return result

    @property
    def name(self) -> str:
        return type(self).__name__
    
    @property
    def description(self) -> Dict:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": "Get answer for user question from knowledge database.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "question": {"type": "string"},
                    },
                    "required": ["question"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        }
