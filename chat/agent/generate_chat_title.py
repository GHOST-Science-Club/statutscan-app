from openai import OpenAI

def generate_chat_title(message:str) -> str:
    client = OpenAI()
    
    response = client.chat.completions.create(
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
    
    return title
