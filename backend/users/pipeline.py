def activate_social_user(backend, user, response, *args, **kwargs):
    if not user.is_active:
        user.is_active = True
        user.save()


def save_username_from_google(backend, user, response, *args, **kwargs):
    """
    save Google name to username field
    """
    if backend.name == "google-oauth2":
        full_name = response.get("name")
        if full_name and not user.username:
            user.username = full_name
            user.save(update_fields=["username"])
