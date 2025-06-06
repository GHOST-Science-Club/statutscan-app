#!/bin/bash

if [ ! -f manage.py ]; then
  cd backend
fi

echo "Migrating changes to database"
python3 manage.py migrate --noinput

echo "Collecting static files"
python3 manage.py collectstatic --noinput

echo "Running application"
uvicorn statutscan_project.asgi:application --host 0.0.0.0 --port ${PORT:-80} --reload
