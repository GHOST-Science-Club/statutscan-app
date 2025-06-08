import os
from django.conf import settings

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import OriginValidator

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", "statutscan_project.settings.production"
)
django_asgi_app = get_asgi_application()

from chat.middleware import JWTAuthMiddleware
from chat import routing

class DebugOriginValidator(OriginValidator):
    async def __call__(self, scope, receive, send):
        origin_header = [v for k, v in scope['headers'] if k == b'origin']
        print("WS Incoming Origin:", origin_header)
        return await super().__call__(scope, receive, send)

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": DebugOriginValidator(
            URLRouter(routing.websocket_urlpatterns),
            settings.CORS_ALLOWED_ORIGINS
        ),
    }
)
