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
    def _create_user(self, email: str, password: str, **extra_fields: Any):
        if not email:
            raise ValueError("Adres e-mail musi zostać podany.")
        if not password:
            raise ValueError("Hasło musi zostać podane.")

        email = self.normalize_email(email)
        validate_email_address(email)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(
        self, email: str, password: Optional[str] = None, **extra_fields: Any
    ):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(
        self, email: str, password: Optional[str] = None, **extra_fields: Any
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser musi mieć ustawione is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser musi mieć ustawione is_superuser=True")

        return self._create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(
        verbose_name="Email address",
        max_length=255,
        unique=True,
    )
    tokens_used = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)
    date_joined = models.DateTimeField("Date joined", default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return str(self.email)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["date_joined"]
