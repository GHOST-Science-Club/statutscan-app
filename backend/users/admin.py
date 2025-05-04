from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser


class CustomUserAdmin(BaseUserAdmin):
    ordering = ["date_joined"]
    list_display = [
        "email",
        "tokens_used",
        "total_tokens_used",
        "is_chat_blocked",
        "is_active",
        "is_staff",
        "last_chat_usage",
        "last_login",
        "date_joined",
    ]
    search_fields = ["email"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (_("Chat info"), {"fields": ("tokens_used", "total_tokens_used", "is_chat_blocked", "last_chat_usage")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                ),
            },
        ),
    )

    readonly_fields = (
        "date_joined",
        "last_login",
        "tokens_used",
        "total_tokens_used",
        "last_chat_usage",
    )

admin.site.register(CustomUser, CustomUserAdmin)
