from djoser.serializers import UserCreateSerializer as BaseCreate
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import CustomUser


class UserCreateSerializer(BaseCreate):
    class Meta(BaseCreate.Meta):
        model = CustomUser
        fields = ("email", "password", "re_password")
        ref_name = "CustomUserCreate"


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = CustomUser
        fields = ("id", "email")
        ref_name = "CustomUserDetail"


class CurrentUserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = CustomUser
        fields = ("id", "email", "tokens_used")
        ref_name = "CustomUserDetail"
