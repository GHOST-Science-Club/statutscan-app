from openai import AsyncOpenAI
from typing import Tuple
from chat.agent.token_usage_manager import TokenUsageManager

token_usage_manager = TokenUsageManager()


async def generate_chat_title(message: str) -> Tuple[str, int]:
    """
    Generates a short (max 32 characters) title for a conversation based on the provided user message 
    using the OpenAI API.

    Returns:
        Tuple[str, int]: A tuple with two value - chat title (str) and tokens used (int).
    """
    client = AsyncOpenAI()
    
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
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
        max_tokens=16,
        temperature=0.7
    )
    
    title = response.choices[0].message.content.strip()
    tokens_used = response.usage.total_tokens

    
    return title
