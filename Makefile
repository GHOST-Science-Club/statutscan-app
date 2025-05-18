build-all:
	docker compose --env-file ./backend/.envs/.env.local -f docker-compose.dev.yml up --build -d --remove-orphans

up-all:
	docker compose --env-file ./backend/.envs/.env.local -f docker-compose.dev.yml up -d

down-all:
	docker compose --env-file ./backend/.envs/.env.local -f docker-compose.dev.yml down

down-all-v:
	docker compose --env-file ./backend/.envs/.env.local -f docker-compose.dev.yml down -v

superuser:
	docker compose -f docker-compose.dev.yml run --rm app python manage.py createsuperuser

flush:
	docker compose -f docker-compose.dev.yml run --rm app python manage.py flush