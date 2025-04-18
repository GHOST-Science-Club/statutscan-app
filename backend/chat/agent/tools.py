import os
import chromadb
from chromadb.utils import embedding_functions
from abc import abstractmethod
from typing import Dict
import asyncio


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
    def __init__(self, persistent_directory: str, collection_name: str, n_reuslts: int=1):
        self.persistent_directory = persistent_directory
        self.collection_name = collection_name
        self.n_reuslts = n_reuslts
        self.__chroma_client = chromadb.PersistentClient(persistent_directory)
        self.__embedding_fn = embedding_functions.OpenAIEmbeddingFunction(
            model_name="text-embedding-3-small", 
            api_key = os.environ["OPENAI_API_KEY"]
        )
        self.__collection = self.__chroma_client.get_collection(
            collection_name,
            embedding_function=self.__embedding_fn
        )

    async def use(self, question:str):
        result = self.__collection.query(query_texts=[question], n_results=self.n_reuslts)
        result = {
            "content": result["documents"][0],
            "metadatas": result["metadatas"][0]
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
