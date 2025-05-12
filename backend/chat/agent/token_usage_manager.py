# chat/agent/token_usage_manager.py

from django.utils import timezone
from django.apps import apps
from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import timedelta
from users.models import CustomUser


class TokenUsageManager:
    def __init__(self):
        self.__token_limit = 10_000
        self.__cooldown_time = 24  # hours
        self.__mongo_connection = apps.get_app_config("chat").mongo_connection
        self.__chat_history = self.__mongo_connection.get_chat_history()

    def __unblock_user_if_possible(self, user: CustomUser):
        if user.last_chat_usage:
            diff = timezone.now() - user.last_chat_usage
            if diff >= timedelta(hours=self.__cooldown_time):
                user.tokens_used = 0
                user.is_chat_blocked = False
                user.save(update_fields=["tokens_used", "is_chat_blocked"])

    def _get_owner_email(self, chat_id: str) -> str | None:
        try:
            _id = ObjectId(chat_id)
        except InvalidId:
            return None
        rec = self.__chat_history.find_one({"_id": _id}, {"email": 1})
        return rec.get("email") if rec else None

    def is_user_blocked(self, user_email: str) -> bool:
        user = CustomUser.objects.filter(email=user_email).first()
        if not user:
            return False
        self.__unblock_user_if_possible(user)
        return user.is_chat_blocked

    def is_chat_blocked(self, chat_id: str) -> bool:
        email = self._get_owner_email(chat_id)
        return self.is_user_blocked(email) if email else False

    def get_reset_date(self, user_email: str) -> str:
        user = CustomUser.objects.filter(email=user_email).first()
        if not user or not user.is_chat_blocked:
            return timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        reset = timezone.now() + timedelta(hours=self.__cooldown_time)
        return reset.strftime("%Y-%m-%d %H:%M:%S")

    def add_used_tokens(self, chat_id: str, tokens: int):
        email = self._get_owner_email(chat_id)
        user = CustomUser.objects.filter(email=email).first() if email else None
        if not user:
            return
        self.__unblock_user_if_possible(user)
        if user.is_chat_blocked:
            return
        user.tokens_used += tokens
        user.total_tokens_used += tokens
        user.last_chat_usage = timezone.now()
        if user.tokens_used >= self.__token_limit:
            user.is_chat_blocked = True
        user.save(
            update_fields=[
                "tokens_used",
                "total_tokens_used",
                "last_chat_usage",
                "is_chat_blocked",
            ]
        )
