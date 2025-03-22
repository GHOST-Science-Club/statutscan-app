import json
import os
from django.shortcuts import render
from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt

from openai import OpenAI
from .agent.memories import Memory
from .agent.tools import KnowledgeBaseTool
from .agent.agents import Agent


# --------------------------------------------------------------------------------------------------------
# This segment is temporary, only for demonstration purposes.
# In final deployment we will use MongoDB for storing chat history.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PERSISTENT_DIRECTORY = os.path.join(BASE_DIR, 'data', 'vector_db', 'chroma_1000signs')

client = OpenAI()
memory = Memory("Jesteś asystente, który ma za zadanie pomagać studentom w problemach administracyjnych.")
kb_tool = KnowledgeBaseTool(PERSISTENT_DIRECTORY, "example", n_reuslts=1)
agent = Agent(client, memory)
agent.add_tool(kb_tool)
# --------------------------------------------------------------------------------------------------------


def chat(request):
    context = {}
    return render(request, 'chat/chat.html', context)


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
