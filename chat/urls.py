from django.urls import path

from . import views

urlpatterns = [
    path('', views.chat, name='chat'),
    path('answer/', views.answer, name="answer"),
]
