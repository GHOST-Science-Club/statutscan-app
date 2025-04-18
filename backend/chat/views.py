# views.py
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import sync_to_async

from .agent.chat_history import ChatHistory

chat_history = ChatHistory()


class ChatRedirectionSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=3000)
    
    def create(self, validated_data):
        return validated_data

    def update(self, instance, validated_data):
        return instance

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    return Response({}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history_view(request, chat_id):
    if not chat_history.chat_exist(chat_id):
        return Response({"error": "Chat doesn't exist."}, status=status.HTTP_404_NOT_FOUND)
    
    owner_email = chat_history.get_owner_email(chat_id)
    if not owner_email or owner_email != request.user.email:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
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
        serializer = ChatRedirectionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        question = serializer.validated_data['question']
        user_email = request.user.email

        if not user_email:
            return Response({"error": "Missing 'user_email'."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            chat_id = await chat_history.create_new_chat(user_email, question)
        except Exception:
            return Response({"error": "Could not create chat."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "redirect_url": f"/chat/{chat_id}?redirection=true"
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
