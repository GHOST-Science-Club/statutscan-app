from django.utils import timezone
from django.apps import apps
from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import timedelta
from users.models import CustomUser


class TokenUsageManager:
    def __init__(self):
        self.__token_limit = 10_000
        self.__cooldown_time = 24 # in hours
        self.__mongo_connection = apps.get_app_config('chat').mongo_connection
        self.__chat_history = self.__mongo_connection.get_chat_history()

    def __unblock_user_if_it_possible(self, user: CustomUser):
        """
        Unblocks the user if the cooldown time has passed since their last chat usage.
        
        Args:
            user (CustomUser): The user to check and unblock if the cooldown has passed.
        """
        if user.last_chat_usage:
            time_diff = timezone.now() - user.last_chat_usage
            if time_diff >= timedelta(hours=self.__cooldown_time):
                user.tokens_used = 0
                user.is_chat_blocked = False
                user.save(update_fields=["tokens_used", "is_chat_blocked"])

    def __get_owner_email(self, chat_id: str) -> str:
        try:
            _id = ObjectId(chat_id)
        except InvalidId:
            return None

        rec = self.__chat_history.find_one({"_id": _id}, {"email": 1})
        return rec.get("email") if rec else None

    def is_chat_blocked(self, chat_id: str) -> bool:
        """
        Checks whether the user associated with a given chat ID is blocked from chatting.
        
        Args:
            chat_id (str): The ID of the chat to find the user.
        
        Returns:
            bool: True if the user is blocked, False if the user is not blocked
        """
        user_email = self.__get_owner_email(chat_id)
        return self.__is_chat_blocked_by_email(user_email)
    
    def is_user_blocked(self, user_email: str) -> bool:
        """
        Checks whether the user with a given emial is blocked from chatting.
        
        Args:
            user_email (str): The email of a user.
        
        Returns:
            bool: True if the user is blocked, False if the user is not blocked
        """
        return self.__is_chat_blocked_by_email(user_email)

    def __is_chat_blocked_by_email(self, user_email: str) -> bool:
        try:
            user = CustomUser.objects.get(email=user_email)
        except CustomUser.DoesNotExist:
            return None

        self.__unblock_user_if_it_possible(user)
        return user.is_chat_blocked
    
    def get_reset_date(self, user_eamil: str) -> str:
        """
        Determines the date and time when the user will be unblocked from chatting.

        Args:
            user_email (str): The email of the user.

        Returns:
            str: The date and time (in '%Y-%m-%d %H:%M:%S' format) when the user will be unblocked.
                If the user is not blocked, it returns the current time.
        """
        if not self.__is_chat_blocked_by_email(user_eamil):
            return timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        
        reset_date = timezone.now() + timedelta(hours=self.__cooldown_time)
        return reset_date.strftime('%Y-%m-%d %H:%M:%S')

    def add_used_tokens(self, chat_id: str, tokens: int):
        """
        Adds tokens to the user's account and checks if the user has exceeded the token limit.
        
        Args:
            chat_id (str): The ID of the chat to find the user.
            tokens (int): The number of tokens to add to the user's account.
        
        Returns:
            None: If the user is blocked or not found.
            This method updates the `tokens_used`, `total_tokens_used`, and `last_chat_usage` fields.
            If the user exceeds the token limit, the user will be blocked.
        """
        user_email = self.__get_owner_email(chat_id)
        try:
            user = CustomUser.objects.get(email=user_email)
        except CustomUser.DoesNotExist:
            return None
        
        self.__unblock_user_if_it_possible(user)

        if user.is_chat_blocked:
            return None
        
        user.tokens_used += tokens
        user.total_tokens_used += tokens
        user.last_chat_usage = timezone.now()

        if user.tokens_used >= self.__token_limit:
            user.is_chat_blocked = True

        user.save(update_fields=["tokens_used", "total_tokens_used", "last_chat_usage", "is_chat_blocked"])
