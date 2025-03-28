import json
import os
from django.shortcuts import render, redirect, HttpResponse
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

    if chat_id is not None:
        if not chat_history.chat_exist(chat_id):
            return HttpResponse("Chat doesn't exist.")

        context["chat_history"] = []
        messages, title = chat_history.get_chat_history_for_html(chat_id)
        
        if title:
            context["title"] = title

        for message in messages:
            if message["role"] in ["user", "assistant"]:
                context["chat_history"].append(message)

    return render(request, 'chat.html', context=context)


def generate_response(question, chat_id):
    stream = agent.ask(question, chat_id)
    for chunk in stream:
        yield json.dumps(chunk)


@csrf_exempt
def answer(request):
    response = json.loads(request.body)
    question = response["question"]
    chat_id = response["chat_id"]
    user_id = "87ie47sfhgr" # in future it should be an id from user session

    if chat_id is not None:
        response = StreamingHttpResponse(generate_response(question, chat_id), status=200, content_type="text/plain")
        return response
    else:
        new_chat_id = chat_history.create_new_chat(user_id, question)
        response = HttpResponse(json.dumps({"redirect": f"/chat/{new_chat_id}/"}), content_type="application/json")
        return response
