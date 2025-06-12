import typing
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs
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
        token = None

        if raw_cookie:
            cookie = SimpleCookie()
            cookie.load(raw_cookie)
            if "access" in cookie:
                token = cookie["access"].value

        if not token:
            query_string = scope.get("query_string", b"").decode()
            params = parse_qs(query_string)
            token_list = params.get("token")
            if token_list:
                token = token_list[0]

        if token:
            try:
                validated_token = await sync_to_async(
                    JWTAuthentication().get_validated_token
                )(token)
                user = await sync_to_async(JWTAuthentication().get_user)(
                    validated_token
                )
                scope["user"] = user
            except Exception:
                pass

        return await self.inner(scope, receive, send)
