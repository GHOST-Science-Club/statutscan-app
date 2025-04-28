from typing import Optional, Any
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import UserManager as DjangoUserManager
from django.core.validators import validate_email
from django.utils import timezone
from django.core.exceptions import ValidationError


def validate_email_address(email: str) -> None:
    try:
        validate_email(email)
    except ValidationError:
        raise ValidationError("Wprowadź poprawny adres email")


class UserManager(DjangoUserManager):
    def _create_user(
        self, email: str, username: str, password: str, **extra_fields: Any
    ):
        if not email:
            raise ValueError("Adres e-mail musi zostać podany.")
        if not username:
            raise ValueError("Nazwa użytkownika (username) musi zostać podana.")

        email = self.normalize_email(email)
        validate_email_address(email)

        user = self.model(email=email, username=username, **extra_fields)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_user(
        self,
        email: str,
        username: str,
        password: Optional[str] = None,
        **extra_fields: Any
    ):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, username, password, **extra_fields)

    def create_superuser(
        self,
        email: str,
        username: str,
        password: Optional[str] = None,
        **extra_fields: Any
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser musi mieć ustawione is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser musi mieć ustawione is_superuser=True")

        return self._create_user(email, username, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        max_length=150,
        unique=True,
    )
    email = models.EmailField(
        verbose_name="Email address",
        max_length=255,
        unique=True,
    )
    tokens_used = models.PositiveIntegerField(default=0)
    total_tokens_used = models.PositiveIntegerField(default=0)
    is_chat_blocked = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    last_chat_usage = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(auto_now=True)
    date_joined = models.DateTimeField("Date joined", default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return str(self.email)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["date_joined"]
