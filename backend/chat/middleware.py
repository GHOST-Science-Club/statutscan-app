# chat/middleware.py
import typing
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from asgiref.sync import sync_to_async
from http.cookies import SimpleCookie


class JWTAuthMiddleware:
    """
    ASGI middleware that reads 'access' JWT from the Cookie header,
    validates it via SimpleJWT and sets scope['user'].
    """

    def __init__(self, inner: typing.Callable):
        self.inner = inner

    def __call__(self, scope):
        return JWTAuthMiddlewareInstance(scope, self.inner)


class JWTAuthMiddlewareInstance:
    def __init__(self, scope, inner):
        self.scope = dict(scope)
        self.inner = inner

    async def __call__(self, receive, send):
        self.scope["user"] = AnonymousUser()

        headers = dict(self.scope.get("headers") or [])
        raw_cookie = headers.get(b"cookie", b"").decode()

        if raw_cookie:
            cookie = SimpleCookie()
            cookie.load(raw_cookie)
            if "access" in cookie:
                token = cookie["access"].value
                try:
                    validated_token = await sync_to_async(
                        JWTAuthentication().get_validated_token
                    )(token)
                    user = await sync_to_async(JWTAuthentication().get_user)(
                        validated_token
                    )
                    self.scope["user"] = user
                except Exception:
                    pass

        inner = self.inner(self.scope)
        return await inner(receive, send)
