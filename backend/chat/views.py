# views.py
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins, viewsets
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from chat.agent.chat_history import ChatHistory
from chat.agent.token_usage_manager import TokenUsageManager

chat_history = ChatHistory()
token_usage_manager = TokenUsageManager()


class ChatRedirectionSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=3000)
    
    def create(self, validated_data):
        return validated_data

    def update(self, instance, validated_data):
        return instance


class ChatRedirectionView(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatRedirectionSerializer
    queryset = []

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    return Response({}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history_view(request, chat_id):
    if not chat_history.chat_exist(chat_id):
        return Response({"error": "Chat doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
    
    owner_email = chat_history.get_owner_email(chat_id)
    if not owner_email or owner_email != request.user.email:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    messages, title = chat_history.get_chat_history_for_html(chat_id)
    data = {"chat_history": messages}
    if title:
        data["title"] = title
    return Response(data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    request_body=ChatRedirectionSerializer,
    responses={201: openapi.Response('Redirect', schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={'redirect_url': openapi.Schema(type=openapi.TYPE_STRING)}
    ))}
)
@api_view(['POST'])
@parser_classes([JSONParser])
@permission_classes([IsAuthenticated])
def chat_redirection_view(request):
    try:
        serializer = ChatRedirectionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        question = serializer.validated_data['question']
        user_email = request.user.email

        if not user_email:
            return Response({"error": "Missing 'user_email'"}, status=status.HTTP_400_BAD_REQUEST)

        if token_usage_manager.is_user_blocked(user_email):
            return Response(
                {"detail": "You have reached your token limit and are blocked from chatting"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            chat_id = chat_history.create_new_chat(user_email, question)
        except Exception as e:
            return Response({"error": "Could not create chat."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "redirect_url": f"/chat/{chat_id}/?redirection=true"
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_chat_view(request, chat_id):
    if not chat_history.chat_exist(chat_id):
        return Response({"error": "Chat doesn't exist."}, status=status.HTTP_404_NOT_FOUND)
    
    if chat_history.delete_chat(chat_id):
        return Response({"detail": "Chat deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"error": "Unable to delete chat"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_list_view(request):
    user_email = request.user.email
    if not user_email:
        return Response({"error": "Missing 'user_email'"}, status=status.HTTP_400_BAD_REQUEST)
    
    user_chats = chat_history.get_user_chats(user_email)
    if not user_chats:
        return Response({"error": "Unable to get user chats"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"chats": user_chats})
