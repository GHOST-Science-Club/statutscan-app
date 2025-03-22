# Set operator system (linux)
FROM python:3.13-slim

# Additional dependencies required for chromadb
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ && \
    rm -rf /var/lib/apt/lists/*

# This option will send all errors to terminal
ENV PYTHONUNBUFFERED=1

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
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]