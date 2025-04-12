# views.py
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import sync_to_async

from .agent.chat_history import ChatHistory

chat_history = ChatHistory()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    return Response({}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history_view(request, chat_id):
    if not chat_history.chat_exist(chat_id):
        return Response({"error": "Chat doesn't exist."}, status=status.HTTP_404_NOT_FOUND)
    
    messages, title = chat_history.get_chat_history_for_html(chat_id)
    data = {"chat_history": messages}
    if title:
        data["title"] = title
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@parser_classes([JSONParser])
@permission_classes([IsAuthenticated])
async def chat_redirection_view(request):
    try:
        question = request.data.get('question')
        user_id = await sync_to_async(lambda: request.user.id)()

        if not question or not user_id:
            return Response({"error": "Missing 'question' or 'user_id'."}, status=status.HTTP_400_BAD_REQUEST)

        chat_id = await chat_history.create_new_chat(user_id, question)

        return Response({
            "redirect_url": f"/chat/{chat_id}?redirection=true"
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
