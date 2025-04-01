import os
from pymongo import MongoClient
from django.apps import AppConfig

class MongoDBConnection:
    def __init__(self):
        mongo_host = os.environ.get('MONGO_HOST')
        if not mongo_host:
            raise ValueError("MONGO_HOST environment variable is not set")
        mongo_db = os.environ.get('MONGO_DATABASE', 'default_db')
        mongo_collection = os.environ.get('MONGO_CHAT_HISTORY', 'default_collection')

        self.client = MongoClient(mongo_host)
        self.db = self.client[mongo_db]
        self.chat_history = self.db[mongo_collection]

    def get_chat_history(self):
        return self.chat_history

class ChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'

    def ready(self):
        self.mongo_connection = MongoDBConnection()
