import os
from django.conf import settings

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "statutscan_project.settings")
django_asgi_app = get_asgi_application()

from chat.middleware import JWTAuthMiddleware
from chat import routing


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            OriginValidator(
                JWTAuthMiddleware(URLRouter(routing.websocket_urlpatterns)),
                settings.CORS_ALLOWED_ORIGINS,
            )
        ),
    }
)
