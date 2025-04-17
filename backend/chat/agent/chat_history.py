import json
from bson.objectid import ObjectId
from typing import List, Tuple
from datetime import datetime
from django.apps import apps
from .generate_id import generate_id
from .generate_chat_title import generate_chat_title


class ChatHistory:
    # System prompt
    __system_prompt = """
Analyze the user’s question. You are an AI assistant whose primary purpose is to help students understand and interpret their university’s statutes, regulations, and other official documents. You are also allowed to answer general questions about the university— including its history, academic programs, campus facilities— and to provide technical assistance regarding any officially supported services (for example, configuring eduroam, VPN access, campus printing, library systems, lab software, or other IT services), as long as your responses are strictly based on official documentation or guidance provided by the institution.

For queries specifically related to academic rules, grading, financial matters, administrative policies, or technical support for official university services, base your responses on the relevant provisions in the documents.

If a student asks a question that does not pertain to the official statutes, documents, or sanctioned technical procedures, politely inform the student that your assistance is limited to official content. For example, you might say:  
> “I’m sorry, but I can only assist with questions based on our university’s official documents or sanctioned service guides.”

Keep your tone friendly and approachable. When possible, support your responses with specific examples or references from the official materials. If a question is vague or broad, ask for clarification to ensure your answer remains relevant and accurate.
"""

    def __init__(self):
        self.mongo_connection = apps.get_app_config('chat').mongo_connection
        self.chat_history = self.mongo_connection.get_chat_history()

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
        chat_id = generate_id()
        chat_title = await generate_chat_title(question)
        creation_date = datetime.now()
        messages = [{
            "role": "user",
            "content": question
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
        """
        Adds a new message to an existing chat.

        Args:
            chat_id (str): The chat ID to which the message should be added.
            message (dict): The message to be added to the chat.
        """
        self.chat_history.update_one(
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
        chat_data = self.chat_history.find_one({"_id": ObjectId(chat_id)})
        return bool(chat_data)

    def get_chat_history_for_agent(self, chat_id: str) -> List[dict]:
        """
        Retrieves the chat history for a specific chat, formatting it for the agent's view.

        Args:
            chat_id (str): The chat ID for which to retrieve the history.

        Returns:
            List[dict]: A list of messages formatted for the agent.
        """
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
        """
        Retrieves the chat history for a specific chat, transforming it for HTML display.

        Args:
            chat_id (str): The chat ID for which to retrieve the history.

        Returns:
            Tuple[List[dict], str]: A tuple containing the list of transformed messages and the chat title.
        """
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
                    message["metadata"] = metadata
                    metadata = {"sources": []}

                transformed_messages.append(message)
                
        return transformed_messages, title

    def get_user_chats(self, user_id: str) -> List[dict]:
        """
        Retrieves a list of chat summaries for a specific user, including chat ID, title, and creation date.

        Args:
            user_id (str): The user ID for which to retrieve chat summaries.

        Returns:
            List[dict]: A list of chat summaries for the user.
        """
        chats = self.chat_history.find(
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
        self.chat_history.delete_one(
            {"_id": ObjectId(chat_id)}
        )
