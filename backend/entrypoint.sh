#!/bin/bash

# Function to wait for MongoDB to become available
wait_for_mongo() {
  host=$1
  retries=5
  delay=5

  while [[ $retries -gt 0 ]]; do
    python3 -c "from pymongo import MongoClient; client = MongoClient('$host', serverSelectionTimeoutMS=1000); client.server_info()"
    if [ $? -eq 0 ]; then
      echo "✔️ INFO:MongoDB: Server created."
      return 0
    else
      retries=$((retries - 1))
      echo "❌ INFO:MongoDB: Don't worry. Server not available yet, retrying in $delay seconds..."
      sleep $delay
    fi
  done

  echo "❌ INFO:MongoDB: Server is not available after several retries."
  exit 1
}

wait_for_mongo $MONGO_HOST

python3 db/build_mongodb.py
python3 db/build_pgvector.py
python3 manage.py migrate --noinput
python3 manage.py collectstatic --noinput
uvicorn statutscan_project.asgi:application --host 0.0.0.0 --port 8000 --reload

