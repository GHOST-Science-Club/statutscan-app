from openai import AsyncOpenAI
from pgvector.django import CosineDistance
from asgiref.sync import sync_to_async
from typing import Dict
from chat.models import Embeddings
from chat.agent.tools.interface import ToolInterface
from chat.agent.token_usage_manager import TokenUsageManager
from pydantic import BaseModel, Field
import asyncio


class KnowledgeBaseTool(ToolInterface):
    def __init__(self, n_results: int=3, model: str="gpt-4o-mini", embedding_model: str="text-embedding-3-small"):
        self.__n_results = n_results
        self.__model = model
        self.__embedding_model = embedding_model
        self.__openai_client = AsyncOpenAI()
        self.__token_usage_manager = TokenUsageManager()

    async def __get_embedding(self, text: str, chat_id: str):
        response = await self.__openai_client.embeddings.create(
            input=[text],
            model=self.__embedding_model
        )
        await sync_to_async(
            self.__token_usage_manager.add_used_tokens,
            thread_sensitive=True
        )(chat_id, response.usage.total_tokens)
        return response.data[0].embedding
    
    async def __is_content_related(self, question: str, content: str, chat_id: str) -> bool:
        class IsDocumentRelated(BaseModel):
            is_document_related: bool = Field(description="Whether a document contain an answer to a question.")

        response = await self.__openai_client.beta.chat.completions.parse(
            messages=[
                {"role": "system", "content": (
                    "You are an assistant that determines if a document contains an answer to a question. "
                    "If you are not sure if document contain an answer return False."
                )},
                {"role": "user", "content": f"Document:\n{question}\n\nQuestion:\n{content}"}
            ],
            temperature=0,
            model=self.__model,
            response_format=IsDocumentRelated
        )

        await sync_to_async(
            self.__token_usage_manager.add_used_tokens,
            thread_sensitive=True
        )(chat_id, response.usage.total_tokens)

        return response.choices[0].message.parsed

    async def use(self, question: str, chat_id: str):
        embedding = await self.__get_embedding(question, chat_id)
        documents = await sync_to_async(
            lambda: list(
                Embeddings.objects.order_by(CosineDistance("embedding", embedding))[:self.__n_results]
            )
        )()

        function_calls = [self.__is_content_related(question, doc.content, chat_id) for doc in documents]
        results = await asyncio.gather(*function_calls)
        documents = [doc for i, doc in enumerate(documents) if results[i].is_document_related]

        contents = []
        links = []
        titles = []

        for doc in documents:
            contents.append(doc.content)
            if doc.metadata["source"] not in links:
                links.append(doc.metadata["source"])
                if "title" in doc.metadata:
                    titles.append(doc.metadata["title"])
                else:
                    titles.append(None)

        content = "\n\n".join([f"{i+1}.\n{content}" for i, content in enumerate(contents)])
        sources = []
        for link, title in zip(links, titles):
            source = {}
            source.setdefault("source", link)
            if title:
                source.setdefault("title", title)
            sources.append(source)

        result = {
            "content": content,
            "metadatas": {
                "sources": sources
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
