#!/bin/sh
set -e

echo "=== Container starting ==="
echo "Python: $(python --version)"
echo "Django settings: $DJANGO_SETTINGS_MODULE"
echo "Database URL set: $([ -n '$DATABASE_URL' ] && echo YES || echo NO)"

echo "=== Testing Django import ==="
python -c "
import sys
print('Python path:', sys.path[:3])
try:
    import django
    print('Django version:', django.__version__)
    import os
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
    django.setup()
    print('Django setup: OK')
except Exception as e:
    import traceback
    print('Django setup FAILED:')
    traceback.print_exc()
    sys.exit(1)
"

echo "=== Running migrations ==="
python manage.py migrate --noinput

echo "=== Starting gunicorn ==="
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 1 \
    --timeout 120 \
    --log-level debug \
    --access-logfile - \
    --error-logfile -
