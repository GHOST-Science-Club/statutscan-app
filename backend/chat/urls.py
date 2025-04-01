# urls.py
from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from .views import chat_history_view, answer_view

schema_view = get_schema_view(
    openapi.Info(
        title="StatutScan API",
        default_version="v1",
        description="Documentation for the Chat API",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("chat/", chat_history_view, name="chat"),
    path("chat/<str:chat_id>/", chat_history_view, name="chat_with_id"),
    path("answer/", answer_view, name="answer"),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
]
