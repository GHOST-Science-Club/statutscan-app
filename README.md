- [Overview](#overview)
- [Setup and Configuration](#setup-and-configuration)
- [BACKEND \& FRONTEND](#backend--frontend)
  - [BACKEND localy](#backend-localy)
  - [FRONTEND localy](#frontend-localy)

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

## BACKEND & FRONTEND
1. Navigate to the backend directory: `cd backend` 
2. Inside the .envs folder, create two environment files:
    - `.env.local` (fill it as `.env.example`)
    - `.env.production`
3. Navigate to the frontend directory: `cd frontend` 
4. Create file `.env` and fill it as `.env.example`
5. Install dependencies: `npm install`
6. Return to the project root: `cd ..`
7. Build and start all services: `make build-all`
8. The project will be available at [http://localhost:3000/]

- to stop containers: `make down-all`
- to stop containers and delete volumes: `make down-all-v`
- to create superuser: `make superuser`

---

### BACKEND localy

1. Go to backend directory using `cd backend`
2. Create in `.envs` folder 2 files:
    - `.env.local` (fill it as `.env.example`)
    - `.env.production`
3. Turn on [Docker Desktop](https://www.docker.com/products/docker-desktop/)
4. Run `make build` in console
5. Go to http://localhost:8000/swagger/

### FRONTEND localy
**Note:** The backend must be running before starting the frontend.
1. Navigate to the frontend directory using `cd frontend`
2. Create file `.env` and fill it as `.env.example`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. The project will be available at [http://localhost:3000/]
