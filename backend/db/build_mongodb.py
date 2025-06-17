import os
import logging
import json
from pathlib import Path
from pymongo import MongoClient
from bson.objectid import ObjectId

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
CURRENT_DIR = f"{BASE_DIR}/db"

logger = logging.getLogger("MongoDB")
logger.setLevel(logging.INFO)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
formatter = logging.Formatter('✔️ %(levelname)s:%(name)s: %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

client = MongoClient(os.environ["MONGO_HOST"])
client.drop_database(os.environ["MONGO_DATABASE"])
db = client[os.environ["MONGO_DATABASE"]]
chat_history_collection = db[os.environ["MONGO_CHAT_HISTORY"]]

try:
    with open(f"{CURRENT_DIR}/examples/example_chats.json", "r", encoding="utf-8-sig") as f:
        example_chat_history_data = json.load(f)["chats"]
    
    for i in range(len(example_chat_history_data)):
        example_chat_history_data[i]["_id"] = ObjectId(example_chat_history_data[i]["_id"])
except Exception as e:
    raise RuntimeError(f"Failed to load data: {e}")

try:
    chat_history_collection.insert_many(example_chat_history_data)
    logger.info("Chat history content added.")
except Exception as e:
    raise RuntimeError(f"Failed to insert data: {e}")

logger.info("Database created.")
