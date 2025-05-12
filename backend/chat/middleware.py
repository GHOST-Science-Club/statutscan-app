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

    async def __call__(self, scope, receive, send):
        scope = dict(scope)

        scope["user"] = AnonymousUser()

        headers = dict(scope.get("headers") or [])
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
                    user = await sync_to_async(
                        JWTAuthentication().get_user
                    )(validated_token)
                    scope["user"] = user
                except Exception:
                    pass

        return await self.inner(scope, receive, send)