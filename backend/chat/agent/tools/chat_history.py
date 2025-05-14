from typing import Dict
from openai import AsyncOpenAI
from asgiref.sync import sync_to_async
from chat.agent.tools.interface import ToolInterface
from chat.agent.chat_history import ChatHistory
from chat.agent.token_usage_manager import TokenUsageManager


class ChatHistoryTool(ToolInterface):
    def __init__(self, n_last_messages: int=5, model: str="gpt-4o-mini", max_output_tokens: int=200):
        self.n_last_messages = n_last_messages
        self.model = model
        self.max_output_tokens = max_output_tokens
        self._client = AsyncOpenAI()
        self._chat_history = ChatHistory()
        self._token_usage_manager = TokenUsageManager()
        self._tool_system_prompt = (
            "You are a helpful assistant whose job is to summarize the chat history."
            "Extract the information needed to answer the user's question. "
            "If chat doesn't contain information needed to answer the question answer "
            "using word None."
        )

    async def use(self, question: str, chat_id: str):
        history = self._chat_history.get_chat_n_last_messages(chat_id, self.n_last_messages)
        
        if len(history) <= 1:
            result = {
                "content": "None",
                "metadatas": {
                    "no_answer": True
                }
            }
            return result

        messages = [
            {"role": "system", "content": self._tool_system_prompt},
            {"role": "user", "content": f"User question: {question}"},
            *history
        ]
        response = await self._client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.5,
            max_tokens=self.max_output_tokens
        )
        await sync_to_async(
            self._token_usage_manager.add_used_tokens,
            thread_sensitive=True
        )(chat_id, response.usage.total_tokens)
        result = {
            "content": response.choices[0].message.content
        }

        if len(result["content"]) <= 10 and "none" in result["content"].lower():
            result = {
                "content": "None",
                "metadatas": {
                    "no_answer": True
                }
            }
            return result

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
                    "required": ["question"]
                }
            }
        }
