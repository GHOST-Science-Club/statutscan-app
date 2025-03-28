import json
from bson.objectid import ObjectId
from typing import List, Tuple
from datetime import datetime
from django.apps import apps
from .generate_id import generate_id
from .generate_chat_title import generate_chat_title


class ChatHistory:
    __system_prompt = "Jesteś asystentem, który ma za zadanie pomagać studentom w problemach administracyjnych."

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

    def chat_exist(self, chat_id: str) -> bool:
        # check if id is valid
        if len(chat_id) != 24:
            return False
        
        for sign in chat_id:
            if sign not in "0123456789abcdef":
                return False

        # check chat existance
        chat_data = self.chat_history.find_one({"_id": ObjectId(chat_id)})
        return bool(chat_data)

    def get_chat_history_for_agent(self, chat_id: str) -> List[dict]:
        chat_data = self.chat_history.find_one(
            {"_id": ObjectId(chat_id)},
            {"messages": 1}
        )
        if chat_data:
            messages = chat_data.get("messages", [])
            messages = [{"role": "system", "content": self.__system_prompt}] + \
                       [
                           {message for key in message.keys() if key != "metadatas"}
                           if (message["role"] == "assistant") and ("metadatas" in messages) else
                           message
                           for message in messages
                       ]
            return messages
        return []

    def get_chat_history_for_html(self, chat_id: str) -> Tuple[List[dict], str]:
        chat_data = self.chat_history.find_one(
            {"_id": ObjectId(chat_id)},
            {"messages": 1, "title": 1}
        )

        if not chat_data:
            return [], None
        
        title = chat_data.get("title", None)
        messages = chat_data.get("messages", [])

        transformed_messages = []
        metadata = {"sources": []}
        for message in messages:
            if message["role"] == "user":
                transformed_messages.append(message)
                continue

            if (message["role"] == "tool") and (message["name"] == "KnowledgeBaseTool"):
                for source in json.loads(message["metadata"]):
                    new_source = {}

                    if "source" in source:
                        new_source["source"] = source["source"]

                    if "title" in source:
                        new_source["title"] = source["title"]

                    metadata["sources"].append(new_source)
                continue

            if message["role"] == "assistant":
                if "tool_calls" in message:
                    continue

                if metadata:
                    new_message = message
                    new_message["metadata"] = metadata
                    transformed_messages.append(new_message)
                    metadata = {"sources": []}

        return transformed_messages, title

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
