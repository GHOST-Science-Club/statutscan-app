# Set operator system (linux)
FROM python:3.12-slim

# Additional dependencies required for chromadb
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ libpq-dev build-essential && \
    rm -rf /var/lib/apt/lists/*

# This option will send all errors to terminal
ENV PYTHONUNBUFFERED=1
ENV MONGO_HOST=mongodb://mongodb:27017/
ENV MONGO_DATABASE=document_db
ENV MONGO_CHAT_HISTORY=chat_history
ENV DJANGO_SETTINGS_MODULE=statutscan_project.settings.local

# Set working directory
WORKDIR /statutscan-project

# Copy and install requirements
COPY requirements.txt requirements.txt
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# Copy all files to image
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run server
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]