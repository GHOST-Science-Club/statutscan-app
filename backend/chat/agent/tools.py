import openai
from abc import abstractmethod
from typing import Dict
from .pgvector import PgVector


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
    def __init__(self, n_reuslts: int=1):
        self.n_reuslts = n_reuslts
        self.pgvector = PgVector()

    async def __get_embedding(text, model: str="text-embedding-3-small"):
        response = await openai.embeddings.create(
            input=[text],
            model=model
        )
        return response.data[0].embedding

    async def use(self, question:str):
        embedding = await self.__get_embedding(question)
        result =  await self.pgvector.query(embedding, n_resilts=self.n_reuslts)
        self.pgvector.close()
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
