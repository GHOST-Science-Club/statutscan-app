#!/bin/bash

# Replace env variables in nginx.conf
if [ -f nginx.template.conf ]; then
    echo "Templating nginx.conf from environment"
    envsubst '$DOMAIN $PORT' < nginx.template.conf > nginx.conf
fi

# Start NGINX
echo "Starting NGINX"
nginx -c "$(pwd)/nginx.conf"

# Start backend (Django)
echo "Starting Django App"
cd backend

echo "[Django] Migrating changes to database"
python3 manage.py migrate --noinput

echo "[Django] Collecting static files"
python3 manage.py collectstatic --noinput

echo "[Django] Running application"
uvicorn statutscan_project.asgi:application --host 0.0.0.0 --port 8000

cd ..

# Start frontend (Next.js)
echo "Starting Next.js App"
cd frontend

echo "[Next.js] Installing dependencies"
npm install

echo "[Next.js] Running application"
npm start -- -p 3000 &

# Wait for all background processes
wait