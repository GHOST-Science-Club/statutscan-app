from django.utils import timezone
from datetime import timedelta
from users.models import CustomUser
from chat.agent.chat_history import ChatHistory

chat_history = ChatHistory()


class TokenUsageManager:
    def __init__(self):
        self.__token_limit = 10_000
        self.__cooldown_time = 24 # in hours

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

    def is_chat_blocked(self, chat_id: str) -> bool:
        """
        Checks whether the user associated with a given chat ID is blocked from chatting.
        
        Args:
            chat_id (str): The ID of the chat to find the user.
        
        Returns:
            bool: True if the user is blocked, False if the user is not blocked
        """
        user_email = chat_history.get_owner_email(chat_id)
        try:
            user = CustomUser.objects.get(email=user_email)
        except CustomUser.DoesNotExist:
            return None

        self.__unblock_user_if_it_possible(user)
        
        return user.is_chat_blocked

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
        user_email = chat_history.get_owner_email(chat_id)
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
