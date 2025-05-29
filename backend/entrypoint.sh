#!/bin/bash

python3 manage.py migrate --noinput
python3 manage.py collectstatic --noinput
uvicorn statutscan_project.asgi:application --host 0.0.0.0 --port 8000 --reload

