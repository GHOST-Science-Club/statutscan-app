from openai import AsyncOpenAI
from abc import abstractmethod
from typing import Dict
from pgvector.django import CosineDistance
from chat.models import Embeddings
from asgiref.sync import sync_to_async
from chat.agent.token_usage_manager import TokenUsageManager

token_usage_manager = TokenUsageManager()


class ToolInterface:
    @abstractmethod
    def use(self):
        """
        The method to use tool.
        """
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        """
        The parameter with tool name.
        """
        pass

    @property
    @abstractmethod
    def description(self) -> Dict:
        """
        The parameter with tool description in dictionary. Compatible with OpenAI API.
        """
        pass


class KnowledgeBaseTool(ToolInterface):
    def __init__(self, n_results: int=1):
        self.n_results = n_results
        self.openai_client = AsyncOpenAI()

    async def __get_embedding(self, text: str, chat_id: str):
        response = await self.openai_client.embeddings.create(
            input=[text],
            model="text-embedding-3-small"
        )
        token_usage_manager.add_used_tokens(chat_id, response.usage.total_tokens)
        return response.data[0].embedding

    async def use(self, question:str, chat_id: str):
        embedding = await self.__get_embedding(question, chat_id)
        documents = await sync_to_async(
            lambda: list(
                Embeddings.objects.order_by(CosineDistance("embedding", embedding))[:self.n_results]
            )
        )()
        result = {
            "content": [document.content for document in documents],
            "metadata": [document.metadata for document in documents]
        }
        return result
    
    async def __call__(self, question: str):
        return await self.use(question)
    
    @property
    def name(self) -> str:
        return type(self).__name__
    
    @property
    def description(self) -> Dict:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": "Uzyskaj odpowiedź na pytanie użytkownika z bazy wiedzy.",
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
