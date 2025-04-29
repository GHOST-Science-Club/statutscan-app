def activate_social_user(backend, user, response, *args, **kwargs):
    if not user.is_active:
        user.is_active = True
        user.save()
