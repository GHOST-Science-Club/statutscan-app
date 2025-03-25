import json
import os
from django.shortcuts import render
from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from .agent.chat_history import ChatHistory
from .agent.tools import KnowledgeBaseTool
from .agent.agent import Agent

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PERSISTENT_DIRECTORY = os.path.join(BASE_DIR, 'data', 'vector_db', 'chroma_1000signs')

client = OpenAI()
chat_history = ChatHistory()
kb_tool = KnowledgeBaseTool(PERSISTENT_DIRECTORY, "example", n_reuslts=1)
agent = Agent(client, chat_history, model="gpt-4o-mini")
agent.add_tool(kb_tool)


def chat(request, chat_id=None):
    context = {}

    if chat_id is None:
        context["chat_history"] = []
        messages, title = chat_history.get_chat_history(chat_id)
        context["title"] = title
        for message in messages:
            if message["role"] in ["user", "assistant"]:
                context["chat_history"].append(message)

    return render(request, 'chat.html', context=context)


def generate_response(question):
    stream = agent.ask(question, model="gpt-4o-mini", stream_answer=True)
    for chunk in stream:
        yield json.dumps(chunk)


@csrf_exempt
def answer(request):
    data = json.loads(request.body)
    message = data["message"]
    response = StreamingHttpResponse(generate_response(message), status=200, content_type="text/plain")
    return response
