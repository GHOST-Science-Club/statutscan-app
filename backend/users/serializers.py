from djoser.serializers import UserCreateSerializer as BaseCreate
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import CustomUser


class UserCreateSerializer(BaseCreate):
    class Meta(BaseCreate.Meta):
        model = CustomUser
        fields = ("id", "email", "username", "password")
        ref_name = "CustomUserCreate"


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = CustomUser
        fields = ("id", "email", "username")
        ref_name = "CustomUserDetail"
