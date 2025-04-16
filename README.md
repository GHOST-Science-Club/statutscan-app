- [Overview](#overview)
- [Setup and Configuration](#setup-and-configuration)
  - [BACKEND](#backend)

## Overview

**StatutScan** is a smart guide that improves school and university administration. It makes important information easy to access, explains rules and procedures, and helps students communicate with administration. It is a web application with a Q&A chatbot using RAG and vector databases with the necessary information sources.

**Demonstration video of the previous version of the project:**
[![Youtube](https://private-user-images.githubusercontent.com/93604008/434386390-0b741790-379b-488d-9f77-623240abb0cf.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDQ4MTUxMjIsIm5iZiI6MTc0NDgxNDgyMiwicGF0aCI6Ii85MzYwNDAwOC80MzQzODYzOTAtMGI3NDE3OTAtMzc5Yi00ODhkLTlmNzctNjIzMjQwYWJiMGNmLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA0MTYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNDE2VDE0NDcwMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPThjYTRlNzlhNGFhMWNkM2QwYzY3MjQ5OTRlM2VjODdlMTY0NWIyMjhlYWFjZDBmNjZjYWJhODA4MGY0YzdkZjMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.BbHfXn1vzq3iAeFrdmj4Z0utZk1pahw-vm7hecZKmTg)](https://www.youtube.com/watch?v=3IKxKgnEjdY)

## Setup and Configuration

1. **Clone the Repository**

   ```bash
   git clone https://github.com/GHOST-Science-Club/statutscan-app.git .
    ```

### BACKEND
1. Go to backend directory using `cd backend`
2. create in `.envs` folder 2 files:
- `.env.local` (fill it as .env.example)
- `.env.production`
3. Turn on [Docker Desktop](https://www.docker.com/products/docker-desktop/)
4. Run `make build` in console
5. Go to http://localhost:8000/swagger/
