# views.py
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.http import StreamingHttpResponse

from openai import OpenAI
from .agent.chat_history import ChatHistory
from .agent.tools import KnowledgeBaseTool
from .agent.agent import Agent
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PERSISTENT_DIRECTORY = os.path.join(BASE_DIR, 'data', 'vector_db', 'chroma_1000signs')

client = OpenAI()
chat_history = ChatHistory()
kb_tool = KnowledgeBaseTool(PERSISTENT_DIRECTORY, "example", n_reuslts=1)
agent = Agent(client, chat_history, model="gpt-4o-mini")
agent.add_tool(kb_tool)

@api_view(['GET'])
def chat_history_view(request, chat_id=None):
    if chat_id is not None:
        if not chat_history.chat_exist(chat_id):
            return Response({"error": "Chat doesn't exist."}, status=status.HTTP_404_NOT_FOUND)
        
        messages, title = chat_history.get_chat_history_for_html(chat_id)
        data = {"chat_history": messages}
        if title:
            data["title"] = title
        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "chat_id is required."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@parser_classes([JSONParser])
def answer_view(request):
    data = request.data
    chat_id = data.get("chat_id")
    question = data.get("question")
    new_chat_redirection = data.get("new_chat_redirection")
    user_id = "41d9f95cb83b64d6c47988e4"

    if new_chat_redirection:
        response = StreamingHttpResponse(
            agent.ask_quietly(chat_id),
            status=200,
            content_type="text/plain"
        )
        response["X-Response-Type"] = "text"
        return response

    if chat_id is not None:
        response = StreamingHttpResponse(
            agent.ask(question, chat_id),
            status=200,
            content_type="text/plain"
        )
        response["X-Response-Type"] = "text"
        return response
    else:
        new_chat_id = chat_history.create_new_chat(user_id, question)
        return Response(
            {"redirect_url": f"/chat/{new_chat_id}?new_chat_redirection=true"},
            status=status.HTTP_200_OK
        )
