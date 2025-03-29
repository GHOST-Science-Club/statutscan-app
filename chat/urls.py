from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat),
    path('chat', views.chat, name='chat'),
    path('chat/<str:chat_id>/', views.chat, name='chat_with_id'),
    path('answer/', views.answer, name="answer"),
]
