from bson.objectid import ObjectId
from typing import List
from datetime import datetime
from django.apps import apps
from .generate_id import generate_id
from .generate_chat_title import generate_chat_title


class ChatHistory:
    __system_prompt = "Jesteś asystente, który ma za zadanie pomagać studentom w problemach administracyjnych."

    def __init__(self):
        self.mongo_connection = apps.get_app_config('chat').mongo_connection
        self.chat_history = self.mongo_connection.get_chat_history()

    def create_new_chat(self, user_id: str, message: dict) -> str:
        chat_id = generate_id()
        chat_title = generate_chat_title(message)
        creation_date = datetime.now()
        messages = [{
            "role": "user",
            "content": message
        }]
        self.chat_history.insert_one({
            "_id": ObjectId(chat_id),
            "user_id": user_id,
            "creation_date": creation_date,
            "title": chat_title,
            "messages": messages
        })
        return chat_id

    def add_new_message(self, chat_id: str, message: dict):
        self.chat_history.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": message}}
        )

    def get_chat_history(self, chat_id: str) -> dict:
        chat_data = self.chat_history.find_one(
            {"_id": ObjectId(chat_id)},
            {"messages": 1}
        )
        if chat_data:
            messages = chat_data.get("messages", [])
            return [{"role": "system", "content": self.__system_prompt}] + messages
        return []

    def get_chat_history_with_title(self, chat_id: str):
        chat_data = self.chat_history.find_one(
            {"_id": ObjectId(chat_id)},
            {"messages": 1, "title": 1}
        )
        if chat_data:
            title = chat_data.get("title", "Untitled Chat")
            messages = chat_data.get("messages", [])
            return [{"role": "system", "content": self.__system_prompt}] + messages, title
        return [], "Untitled Chat"

    def get_user_chats(self, user_id: str) -> List[dict]:
        chats = self.chat_history.find(
            {"user_id": user_id},
            {"_id": 1, "title": 1, "creation_date": 1}
        )
        return list(chats)

    def delete_chat(self, chat_id: str):
        self.chat_history.delete_one(
            {"_id": ObjectId(chat_id)}
        )
