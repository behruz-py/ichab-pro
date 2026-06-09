#!/bin/sh
set -e

PORT="${PORT:-8000}"

echo "[start] Running migrations..."
python manage.py migrate --noinput

echo "[start] Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "[start] Creating superuser if not exists..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@ichab.uz', 'Ichab@2024!')
    print('Superuser created: admin')
else:
    print('Superuser already exists')
"

echo "[start] Launching gunicorn on port ${PORT}..."
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT}" \
    --workers 2 \
    --timeout 120 \
    --log-level info \
    --access-logfile - \
    --error-logfile -
