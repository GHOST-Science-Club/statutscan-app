import os
from pymongo import MongoClient
from django.apps import AppConfig


class ChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'


class MongoDBConnection:
    client = MongoClient(os.environ['MONGO_HOST'])
    db = client[os.environ['MONGO_DATABASE']]
    chat_history = db[os.environ['MONGO_CHAT_HISTORY']]
