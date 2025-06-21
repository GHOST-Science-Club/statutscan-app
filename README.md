![release version](https://img.shields.io/github/v/release/GHOST-Science-Club/statutscan-app)

## Overview

**StatutScan** is a smart guide that improves school and university administration. It makes important information easy
to access, explains rules and procedures, and helps students communicate with administration. It is a web application
with a Q&A chatbot using RAG and vector databases with the necessary information sources.

[Link to the project website](https://calm-desert-09ff95e03.6.azurestaticapps.net)

## Technologies used
<p align="center">
    <img src="https://skillicons.dev/icons?i=django"/>
    <img src="https://skillicons.dev/icons?i=next"/>
    <img src="https://github.com/user-attachments/assets/ccb2f267-2a32-44ea-a272-2d112db38d10" width="48px" height="48px"/>
    <img src="https://skillicons.dev/icons?i=docker"/>
    <img src="https://skillicons.dev/icons?i=postgresql"/>
    <img src="https://skillicons.dev/icons?i=mongo"/>
    <img src="https://skillicons.dev/icons?i=redis"/>
    <img src="https://skillicons.dev/icons?i=azure"/>
</p>

## Setup and Configuration

#### Clone the Repository
```bash
git clone https://github.com/GHOST-Science-Club/statutscan-app.git .
```

#### BACKEND & FRONTEND
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

#### BACKEND localy

1. Go to backend directory using `cd backend`
2. Create in `.envs` folder 2 files:
    - `.env.local` (fill it as `.env.example`)
    - `.env.production`
3. Turn on [Docker Desktop](https://www.docker.com/products/docker-desktop/)
4. Run `make build` in console
5. Go to http://localhost:8000/swagger/

#### FRONTEND localy
**Note:** The backend must be running before starting the frontend.
1. Navigate to the frontend directory using `cd frontend`
2. Create file `.env` and fill it as `.env.example`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. The project will be available at [http://localhost:3000/]

## Team
- Maksymilian Norkiewicz
- Jędrzej Ogrodowski
- Ilya Yanukovich
- Beniamin Szawracki
- Darya Murzich

## Contact
✉️ maksymiliannorkiewicz@gmail.com
