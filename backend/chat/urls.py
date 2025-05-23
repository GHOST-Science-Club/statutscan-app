from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.chat_view, name='chat'),
    path('chat/redirect/', views.chat_redirection_view, name='chat-redirect'),
    path('chat/<str:chat_id>/', views.chat_detail_view, name='chat-detail'),
    path('chats/', views.chat_list_view, name='chat-list')
]
