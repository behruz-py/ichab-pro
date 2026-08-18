#!/bin/sh
set -e

PORT="${PORT:-8000}"

echo "[start] Running migrations..."
python manage.py migrate --noinput

echo "[start] Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "[start] Creating superuser if credentials are provided and it doesn't exist..."
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    python manage.py shell -c "
from django.contrib.auth import get_user_model
import os
User = get_user_model()
username = os.environ['DJANGO_SUPERUSER_USERNAME']
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username,
        os.environ.get('DJANGO_SUPERUSER_EMAIL', ''),
        os.environ['DJANGO_SUPERUSER_PASSWORD'],
    )
    print(f'Superuser created: {username}')
else:
    print('Superuser already exists')
"
else
    echo "[start] DJANGO_SUPERUSER_USERNAME / DJANGO_SUPERUSER_PASSWORD not set — skipping superuser creation."
fi

echo "[start] Launching gunicorn on port ${PORT}..."
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT}" \
    --workers 2 \
    --timeout 120 \
    --log-level info \
    --access-logfile - \
    --error-logfile -
