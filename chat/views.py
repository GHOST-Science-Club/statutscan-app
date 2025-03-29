import json
import os
from django.shortcuts import render, HttpResponse
from django.http import StreamingHttpResponse, JsonResponse
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
        
        context["chat_history"] = messages

        if title:
            context["title"] = title

    return render(request, 'chat.html', context=context)


@csrf_exempt
def answer(request):
    response = json.loads(request.body)

    chat_id = response["chat_id"] if "chat_id" in response else None
    question = response["question"] if "question" in response else None
    new_chat_redirection = response["new_chat_redirection"] if "new_chat_redirection" in response else None
    user_id = "41d9f95cb83b64d6c47988e4" # in future it should be an id from user session

    if new_chat_redirection:
        response = StreamingHttpResponse(agent.ask_quietly(chat_id), status=200, content_type="text/plain")
        response["X-Response-Type"] = "text"
        return response

    if chat_id is not None:
        response = StreamingHttpResponse(agent.ask(question, chat_id), status=200, content_type="text/plain")
        response["X-Response-Type"] = "text"
        return response
    else:
        new_chat_id = chat_history.create_new_chat(user_id, question)
        return JsonResponse({"redirect_url": f"/chat/{new_chat_id}?new_chat_redirection=true"})
