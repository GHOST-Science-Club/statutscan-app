build:
	docker compose --env-file ./.envs/.env.local -f docker-compose.yml up --build -d --remove-orphans

up:
	docker compose -f docker-compose.yml up -d

down:
	docker compose -f docker-compose.yml down

down-v:
	docker compose -f docker-compose.yml down -v

makemigrations:
	docker compose -f docker-compose.yml run --rm app python manage.py makemigrations

migrate:
	docker compose -f docker-compose.yml run --rm app python manage.py migrate

collectstatic:
	docker compose -f docker-compose.yml run --rm app python manage.py collectstatic --noinput --clear

superuser:
	docker compose -f docker-compose.yml run --rm app python manage.py createsuperuser

flush:
	docker compose -f docker-compose.yml run --rm app python manage.py flush