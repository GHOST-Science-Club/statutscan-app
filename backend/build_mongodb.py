import os
import logging
from pymongo import MongoClient
from bson.objectid import ObjectId

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MongoDB")
logger.info("Start creating database.")

client = MongoClient(os.environ["MONGO_HOST"])
client.drop_database(os.environ["MONGO_DATABASE"])
db = client[os.environ["MONGO_DATABASE"]]
chat_history_collection = db[os.environ["MONGO_CHAT_HISTORY"]]

example_chat_history_data = [
  {"_id": ObjectId("41d9f95cb83b546fc3f29472"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "Kim jesteś?"}, {"role": "assistant", "content": "Jestem asystentem służącym do pomocy studentom w sprawach administracyjnych."}]},
  {"_id": ObjectId("41d9f95cb83b546fc3f2b142"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "How to cook egg?"}, {"role": "assistant", "content": "You have to put egg to boiling water and wait 8 minutes."}]},
  {"_id": ObjectId("41d9f95cb83b546fbb6834f2"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "How do I make a cup of tea?"}, {"role": "assistant", "content": "Boil water, then pour it over the tea bag and steep for 3-5 minutes."}]},
  {"_id": ObjectId("41d9f95cb83b546f2d2b5bfd"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "What is the capital of France?"}, {"role": "assistant", "content": "The capital of France is Paris."}]},
  {"_id": ObjectId("41d9f95cb83b546ffe8945bf"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "How do I tie a tie?"}, {"role": "assistant", "content": "Place the tie around your neck, form a knot, and pull the wide end through the loop."}]},
  {"_id": ObjectId("41d9f95cb83b546f5f730c25"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "How do I change a tire?"}, {"role": "assistant", "content": "Lift the car with a jack, remove the lug nuts, replace the tire, and tighten the lug nuts."}]},
  {"_id": ObjectId("41d9f95cb83b546fdcfdf2e8"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "What are some good workout tips?"}, {"role": "assistant", "content": "Start with a warm-up, focus on proper form, and gradually increase intensity."}]},
  {"_id": ObjectId("41d9f95cb83b64d6bf629597"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "Can you help me with math?"}, {"role": "assistant", "content": "Sure! What math problem are you working on?"}]},
  {"_id": ObjectId("41d9f95cb83b64d624181bda"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "What is 15 multiplied by 9?"}, {"role": "assistant", "content": "15 multiplied by 9 is 135."}]},
  {"_id": ObjectId("41d9f95cb83b64d67d9f5e27"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "How do I improve my writing?"}, {"role": "assistant", "content": "Practice writing daily, read often, and focus on grammar and clarity."}]},
  {"_id": ObjectId("41d9f95cb83b64d6d0e33b45"), "email": "yanukovichilya@gmail.com", "messages": [{"role": "user", "content": "What's the best way to manage stress?"}, {"role": "assistant", "content": "Exercise, mindfulness, and getting enough sleep are great ways to manage stress."}]},
  {"_id": ObjectId("41d9f95cb83b64d6ce0acccf"), "email": "test@gmail.com", "messages": [{"role": "user", "content": "Can you suggest a good book to read?"}, {"role": "assistant", "content": "You might enjoy 'To Kill a Mockingbird' by Harper Lee."}]}
]

try:
    chat_history_collection.insert_many(example_chat_history_data)
    logger.info("Chat history content added.")
except Exception as e:
    raise f"An error occurred: {e}"

logger.info("Database created.")
