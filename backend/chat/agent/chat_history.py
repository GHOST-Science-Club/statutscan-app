import uuid
from bson.objectid import ObjectId
from bson.errors import InvalidId
from typing import List, Tuple, Optional
from datetime import datetime
from django.apps import apps
from chat.agent.generate_chat_title import generate_chat_title
from chat.agent.prompt_injection import PromptInjection


class ChatHistory:
    def __init__(self):
        self._mongo_connection = apps.get_app_config('chat').mongo_connection
        self._chat_history = self._mongo_connection.get_chat_history()
        self._prompt_injection = PromptInjection()

    async def create_new_chat(self, user_id: str, question: str) -> str:
        """
        Creates a new chat entry in the database, generating a unique chat ID, 
        a title based on the user's question, and storing the initial message.

        Args:
            user_id (str): The user ID initiating the chat.
            question (str): The initial question/message from the user.

        Returns:
            str: The generated chat ID.
        """
        chat_id = uuid.uuid4().hex[:24]
        chat_title = await generate_chat_title(question, chat_id)
        creation_date = datetime.now()
        messages = [{
            "role": "user",
            "content": question
        }]
        self._chat_history.insert_one({
            "_id": ObjectId(chat_id),
            "user_id": user_id,
            "creation_date": creation_date,
            "title": chat_title,
            "messages": messages
        })
        return chat_id

    def add_new_message(self, chat_id: str, message: dict):
        """
        Adds a new message to an existing chat.

        Args:
            chat_id (str): The chat ID to which the message should be added.
            message (dict): The message to be added to the chat.
        """
        self._chat_history.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": message}}
        )

    def chat_exist(self, chat_id: str) -> bool:
        """
        Checks if a chat exists by verifying its ID.

        Args:
            chat_id (str): The chat ID to check.

        Returns:
            bool: True if the chat exists, False otherwise.
        """
        # check if id is valid
        if len(chat_id) != 24:
            return False
        
        for sign in chat_id:
            if sign not in "0123456789abcdef":
                return False

        # check chat existance
        chat_data = self._chat_history.find_one({"_id": ObjectId(chat_id)})
        return bool(chat_data)
    
    def get_chat_last_message(self, chat_id: str) -> dict:
        """
        Retrieve the last message from the chat history for a given chat ID.

        Args:
            chat_id (str): The unique identifier of the chat.

        Returns:
            dict: Last message.
        """
        chat_data = self.get_chat_history_for_agent(chat_id)
        return chat_data[-1]
    
    def get_chat_n_last_messages(self, chat_id: str, n_last: int) -> List[dict]:
        """
        Retrieve the last `n_last` messages from the chat history for a given chat ID.

        Args:
            chat_id (str): The unique identifier of the chat.
            n_last (int): The number of most recent messages to retrieve.

        Returns:
            List[dict]: A list of the last `n_last` messages.
        """
        if n_last <= 0:
            return []

        chat_data = self.get_chat_history_for_agent(chat_id)
        return chat_data[-n_last:]

    def get_chat_history_for_agent(self, chat_id: str) -> List[dict]:
        """
        Retrieves the chat history for a specific chat, formatting it for the agent's view.

        Args:
            chat_id (str): The chat ID for which to retrieve the history.

        Returns:
            List[dict]: A list of messages formatted for the agent.
        """
        chat_data = self._chat_history.find_one(
            {"_id": ObjectId(chat_id)},
            {"messages": 1}
        )
        
        if not chat_data:
            return []

        messages = []
        for message in chat_data.get("messages", []):
            if message.get("role") not in ["user", "assistant"]:
                continue

            if message.get("role") == "user" and message.get("metadatas").get("prompt_injection") == True:
                continue

            messages.append({
                "role": message["role"],
                "content": message["content"]
            })

        return messages

    def get_chat_history_for_html(self, chat_id: str) -> Tuple[List[dict], str]:
        """
        Retrieves the chat history for a specific chat, transforming it for HTML display.

        Args:
            chat_id (str): The chat ID for which to retrieve the history.

        Returns:
            Tuple[List[dict], str]: A tuple containing the list of transformed messages and the chat title.
        """
        chat_data = self._chat_history.find_one(
            {"_id": ObjectId(chat_id)},
            {"messages": 1, "title": 1}
        )

        if not chat_data:
            return [], None
        
        title = chat_data.get("title", None)
        messages = []
        for message in chat_data.get("messages", []):
            if message.get("role") not in ["user", "assistant"]:
                continue

            if "metadata" in message and "sources" in message.get("metadata"):
                messages.append({
                    "role": message["role"],
                    "content": message["content"],
                    "metadata": {
                        "sources": message["metadata"]["sources"]
                    }
                })
            else:
                messages.append({
                    "role": message["role"],
                    "content": message["content"]
                })
        
        return messages, title

    def get_user_chats(self, user_id: str) -> List[dict]:
        """
        Retrieves a list of chat summaries for a specific user, including chat ID, title, and creation date.

        Args:
            user_id (str): The user ID for which to retrieve chat summaries.

        Returns:
            List[dict]: A list of chat summaries for the user.
        """
        chats = self._chat_history.find(
            {"user_id": user_id},
            {"_id": 1, "title": 1, "creation_date": 1}
        )
        return list(chats)

    def delete_chat(self, chat_id: str):
        """
        Deletes a specific chat from the database.

        Args:
            chat_id (str): The chat ID to delete.
        """
        self._chat_history.delete_one(
            {"_id": ObjectId(chat_id)}
        )

    def flag_last_message_as_prompt_injection(self, chat_id: str):
        """
        Flags the last user message in a chat as a prompt injection.

        Args:
            chat_id (str): The unique identifier of the chat document in the database.
        """
        chat_data = self._chat_history.find_one(
            {"_id": ObjectId(chat_id)},
            {"messages": 1}
        )

        if not chat_data:
            return None

        messages = chat_data.get("messages", [])

        if len(messages) == 0:
            return None
        
        for i, message in reversed(tuple(enumerate(messages))):
            if message.get("role") != "user":
                continue

            messages[i].setdefault("metadatas", {})
            messages[i].get("metadatas").setdefault("prompt_injection", True)
            break

        self._chat_history.update_one(
            {"_id": ObjectId(chat_id)},
            {"$set": {"messages": messages}}
        )

    def get_owner_email(self, chat_id: str) -> Optional[str]:
        """
        Fetches the 'email' of the owner for the given chat_id.
        """
        try:
            _id = ObjectId(chat_id)
        except InvalidId:
            return None

        rec = self._chat_history.find_one({"_id": _id}, {"email": 1})
        return rec.get("email") if rec else None
