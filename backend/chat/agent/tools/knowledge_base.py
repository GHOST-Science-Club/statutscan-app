from openai import AsyncOpenAI
from pgvector.django import CosineDistance
from asgiref.sync import sync_to_async
from typing import Dict
from chat.models import Embeddings
from chat.agent.tools.interface import ToolInterface
from chat.agent.token_usage_manager import TokenUsageManager


class KnowledgeBaseTool(ToolInterface):
    def __init__(self, n_results: int=3, embedding_model: str="text-embedding-3-small"):
        self.n_results = n_results
        self.embedding_model = embedding_model
        self._openai_client = AsyncOpenAI()
        self._token_usage_manager = TokenUsageManager()

    async def __get_embedding(self, text: str, chat_id: str):
        response = await self._openai_client.embeddings.create(
            input=[text],
            model=self.embedding_model
        )
        await sync_to_async(
            self._token_usage_manager.add_used_tokens,
            thread_sensitive=True
        )(chat_id, response.usage.total_tokens)
        return response.data[0].embedding

    async def use(self, question:str, chat_id: str):
        embedding = await self.__get_embedding(question, chat_id)
        documents = await sync_to_async(
            lambda: list(
                Embeddings.objects.order_by(CosineDistance("embedding", embedding))[:self.n_results]
            )
        )()
        result = {
            "content": "\n\n".join([f"{i+1}.\n{document.content}" for i, document in enumerate(documents)]),
            "metadatas": {
                "sources": [document.metadata for document in documents]
            }
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
