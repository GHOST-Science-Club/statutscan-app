from ..apps import MongoDBConnection
from bson.objectid import ObjectId
from typing import List
from .generate_id import generate_id
from .generate_chat_title import generate_chat_title
from datetime import datetime


class ChatHistory:
    __system_prompt = "Jesteś asystente, który ma za zadanie pomagać studentom w problemach administracyjnych."

    @staticmethod
    def create_new_chat(user_id:str, message:dict) -> str:
        chat_id = generate_id()
        chat_title = generate_chat_title(message)
        creation_date = datetime.now()
        messages = [{
            "role": "user",
            "content": message
        }]
        MongoDBConnection.chat_history.insert_one({
            "_id": ObjectId(chat_id),
            "user_id": user_id,
            "creation_date": creation_date,
            "title": chat_title,
            "messages": messages
        })

    @staticmethod
    def add_new_message(chat_id:str, message:dict):
        MongoDBConnection.chat_history.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": message}}
        )

    @staticmethod
    def get_chat_history(chat_id:str) -> dict:
        chat_history = MongoDBConnection.chat_history.find_one(
            {"_id": ObjectId(chat_id)},
            {"messages": 1}
        )
        chat_history = chat_history["messages"]
        chat_history = [{"role": "system", "content": ChatHistory.__system_prompt}] + chat_history
        return chat_history

    @staticmethod
    def get_user_chats(user_id:str) -> List[dict]:
        chats = MongoDBConnection.chat_history.find(
            {"user_id": user_id},
            {"_id": 1, "title": 1, "creation_date": 1}
        )
        return list(chats)

    @staticmethod
    def delete_chat(chat_id:str):
        MongoDBConnection.chat_history.delete_one(
            {"_id", ObjectId(chat_id)}
        )
