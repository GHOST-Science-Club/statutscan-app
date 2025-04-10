from djoser import email


class CustomActivationEmail(email.ActivationEmail):
    template_name = "djoser/email/activation.html"
    subject_template_name = "djoser/email/activation_subject.txt"
    # text_template_name = "djoser/email/activation.txt"


class CustomConfirmationEmail(email.ActivationEmail):
    template_name = "djoser/email/confirmation.html"
    subject_template_name = "djoser/email/confirmation_subject.txt"
    # text_template_name = "djoser/email/confirmation.txt"


class CustomPasswordResetEmail(email.PasswordResetEmail):
    template_name = "djoser/email/password_reset.html"
    subject_template_name = "djoser/email/password_reset_subject.txt"
    # text_template_name = "djoser/email/password_reset.txt"
