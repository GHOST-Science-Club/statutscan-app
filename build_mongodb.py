import os
from pymongo import MongoClient

client = MongoClient(os.environ["MONGO_HOST"])

print("Database cleaned.")
client.drop_database(os.environ["MONGO_DB"])

db = client[os.environ["MONGO_DB"]]
chat_history_collection = db[os.environ["MONGO_CHAT_HISTORY"]]

example_chat_history_data = [
  {"chat_id": "bjhDZBSo51ChSfftQWgj", "user_id": "qDZGRCmgyypNDF8TEsrd", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "How to cook egg?"}, {"role": "assistant", "content": "You have to put egg to boiling water and wait 8 minutes."}]},
  {"chat_id": "e5TR6ZDwX7FNw8H6G5RM", "user_id": "t2PwnkQq79BdGcX3rkmn", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "How do I make a cup of tea?"}, {"role": "assistant", "content": "Boil water, then pour it over the tea bag and steep for 3-5 minutes."}]},
  {"chat_id": "ktYt4J16NHGsA76Mwp94", "user_id": "T2nFDj8vPAu43Rf5B8pA", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "What is the capital of France?"}, {"role": "assistant", "content": "The capital of France is Paris."}]},
  {"chat_id": "jc7Gi2XNQwOaJ3Yz4MuL", "user_id": "qDZGRCmgyypNDF8TEsrd", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "How do I tie a tie?"}, {"role": "assistant", "content": "Place the tie around your neck, form a knot, and pull the wide end through the loop."}]},
  {"chat_id": "mHc3JKB5a14LdPxKZWm8", "user_id": "wq4NjzU11gLDysn1Obnv", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "How do I change a tire?"}, {"role": "assistant", "content": "Lift the car with a jack, remove the lug nuts, replace the tire, and tighten the lug nuts."}]},
  {"chat_id": "p9Hx9Xt8Lk7yUi1Eo1FW", "user_id": "uFGTtQvc2B5p8Nh7XyUs", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "What are some good workout tips?"}, {"role": "assistant", "content": "Start with a warm-up, focus on proper form, and gradually increase intensity."}]},
  {"chat_id": "uK8YP16DsTW1F9xOs3Fz", "user_id": "wq4NjzU11gLDysn1Obnv", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "Can you help me with math?"}, {"role": "assistant", "content": "Sure! What math problem are you working on?"}]},
  {"chat_id": "g5Gm9XPqJ0tLVmT2kWs9", "user_id": "T2nFDj8vPAu43Rf5B8pA", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "What is 15 multiplied by 9?"}, {"role": "assistant", "content": "15 multiplied by 9 is 135."}]},
  {"chat_id": "ydTgV3ZR96dMPh89F9V2", "user_id": "v1H9GFDqA7FsNxJx1MdN", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "How do I improve my writing?"}, {"role": "assistant", "content": "Practice writing daily, read often, and focus on grammar and clarity."}]},
  {"chat_id": "v5Cm8SFW27VqkG1wRi44", "user_id": "t2PwnkQq79BdGcX3rkmn", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "What's the best way to manage stress?"}, {"role": "assistant", "content": "Exercise, mindfulness, and getting enough sleep are great ways to manage stress."}]},
  {"chat_id": "d6PZl8KwK8VbDwZ4h1Ow", "user_id": "v1H9GFDqA7FsNxJx1MdN", "messages": [{"role": "system", "content": "You are a helful assistant"}, {"role": "user", "content": "Can you suggest a good book to read?"}, {"role": "assistant", "content": "You might enjoy 'To Kill a Mockingbird' by Harper Lee."}]}
]

try:
    chat_history_collection.insert_many(example_chat_history_data)
    print("Chat history content added.")
except Exception as e:
    raise f"An error occurred: {e}"

print("Database builed.")
