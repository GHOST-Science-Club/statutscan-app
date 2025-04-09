from django.urls import path, re_path
from .views import chat_history_view, answer_view

urlpatterns = [
    path("chat/", chat_history_view, name="chat"),
    path("chat/<str:chat_id>/", chat_history_view, name="chat_with_id"),
    path("answer/", answer_view, name="answer"),
]
