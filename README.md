- [Overview](#overview)
- [Setup and Configuration](#setup-and-configuration)
    - [BACKEND](#backend)
    - [FRONTEND](#frontend)

## Overview

**StatutScan** is a smart guide that improves school and university administration. It makes important information easy
to access, explains rules and procedures, and helps students communicate with administration. It is a web application
with a Q&A chatbot using RAG and vector databases with the necessary information sources.

**Demonstration video of the previous version of the project:**

[![Youtube](https://i.postimg.cc/XYVqJ23V/statutscan-demo-thumbnail.png)](https://www.youtube.com/watch?v=3IKxKgnEjdY)

## Setup and Configuration

1. **Clone the Repository**

   ```bash
   git clone https://github.com/GHOST-Science-Club/statutscan-app.git .
    ```

### BACKEND

1. Go to backend directory using `cd backend`
2. Create in `.envs` folder 2 files:
    - `.env.local` (fill it as .env.example)
    - `.env.production`
3. Turn on [Docker Desktop](https://www.docker.com/products/docker-desktop/)
4. Run `make build` in console
5. Go to http://localhost:8000/swagger/

### FRONTEND

1. Go to frontend directory using `cd frontend`
2. Create file `.env` and fill it as `.env.example`
3. Run `npm run dev` in console
4. Project is ready on http://localhost:3000/
