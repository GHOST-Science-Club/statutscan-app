# users/validators.py
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.contrib.auth.models import AnonymousUser


class NewPasswordNotSameAsOldValidator:
    def validate(self, password, user=None):
        if not user or isinstance(user, AnonymousUser):
            return
        if user.check_password(password):
            raise ValidationError(
                _("Your new password must be different from the old password."),
                code="password_no_change",
            )

    def get_help_text(self):
        return _("Your new password must be different from the old one.")
