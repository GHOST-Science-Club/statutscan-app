from openai import OpenAI
from typing import Tuple
from chat.agent.token_usage_manager import TokenUsageManager

token_usage_manager = TokenUsageManager()


def generate_chat_title(message: str, chat_id: str, model: str="gpt-4o-mini") -> str:
    """
    Generates a short title for a conversation based on the provided user message 
    using the OpenAI API.

    Args:
        message (str): 
        chat_id (str): 

    Returns:
        str: A +- 32-character chat title.
    """
    client = OpenAI()
    
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "Generate a short title (max 32 characters) for a conversation based on the given user message."
            },
            {
                "role": "user",
                "content": message
            }
        ],
        temperature=0.7
    )
    
    title = response.choices[0].message.content.strip()
    token_usage_manager.add_used_tokens(chat_id, response.usage.total_tokens)

    return title
