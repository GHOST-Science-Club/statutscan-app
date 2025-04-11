# views.py
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.http import StreamingHttpResponse

from .agent.chat_history import ChatHistory

chat_history = ChatHistory()


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
