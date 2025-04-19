import os
import asyncpg
from typing import List, Dict
import ast

class PgVector:
    def __init__(self):
        self.POSTGRES_DB = os.getenv("POSTGRES_DB")
        self.POSTGRES_USER = os.getenv("POSTGRES_USER")
        self.POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
        self.POSTGRES_HOST = os.getenv("POSTGRES_HOST")
        self.POSTGRES_PORT = os.getenv("POSTGRES_PORT")
        self.conn = None

    async def connect(self):
        """
        Establishes an asynchronous connection to the PostgreSQL database
        using the stored credentials.
        """
        self.conn = await asyncpg.connect(
            user=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            database=self.POSTGRES_DB,
            host=self.POSTGRES_HOST,
            port=int(self.POSTGRES_PORT)
        )

    async def close(self):
        """
        Closes the asynchronous connection to the PostgreSQL database if it exists.
        """
        if self.conn:
            await self.conn.close()
        self.conn = None

    async def query(self, embedding: List[float], n_results: int = 1) -> Dict:
        """
        Queries the 'embeddings' table to find the top `n_results` most similar vectors
        to the given embedding using cosine similarity.

        Args:
            embedding (List[float]): The input vector to compare against stored embeddings.
            n_results (int, optional): Number of most similar results to return. Defaults to 1.

        Returns:
            Dict: A dictionary containing lists of ids, contents, metadata, embeddings,
                  and cosine similarities of the top matching records.
        """
        if not self.conn:
            await self.connect()

        try:
            query = f"""
            SELECT
                id,
                content,
                metadata,
                embedding,
                1 - (embedding <=> $1::vector) AS cosine_similarity
            FROM embeddings
            ORDER BY cosine_similarity DESC
            LIMIT {n_results};
            """
            data = await self.conn.fetch(query, embedding)
        except Exception as e:
            raise RuntimeError(f"Failed during query execision: {e}")

        return {
            "id": [row["id"] for row in data],
            "content": [row["content"] for row in data],
            "metadata": [row["metadata"] for row in data],
            "embedding": [ast.literal_eval(row["embedding"]) for row in data],
            "cosine_similarity": [row["cosine_similarity"] for row in data]
        }
