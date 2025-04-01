from os import getenv, path
from dotenv import load_dotenv
from .base import *  # noqa
from .base import BASE_DIR


local_env_file = path.join(BASE_DIR, ".envs", ".env.local")

if path.isfile(local_env_file):
    load_dotenv(local_env_file)

SECRET_KEY = getenv("SECRET_KEY")

DEBUG = getenv("DEBUG", "False").lower() in ["true", "1", "yes"]

SITE_NAME = getenv("SITE_NAME")

ALLOWED_HOSTS = getenv("ALLOWED_HOSTS", "127.0.0.1").split(",")

CSRF_TRUSTED_ORIGINS = ["http://localhost:8080", "http://localhost:3000"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
