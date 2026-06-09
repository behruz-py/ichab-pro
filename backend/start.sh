#!/bin/sh
set -e

echo "=== STARTUP: PORT=${PORT:-NOT_SET} ==="
echo "=== Python: $(python --version 2>&1) ==="
echo "=== Working dir: $(pwd) ==="

echo "=== Testing gunicorn binary ==="
gunicorn --version

echo "=== Testing Django settings import ==="
python -c "
import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
print('Importing Django...')
import django
print('Django version:', django.__version__)
print('Setting up Django...')
try:
    django.setup()
    print('Django setup OK')
except Exception as e:
    print('Django setup FAILED:', e)
    import traceback; traceback.print_exc()
    sys.exit(1)
print('Importing WSGI app...')
from config.wsgi import application
print('WSGI app OK')
"

echo "=== Launching gunicorn on port ${PORT:-8000} ==="
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers 1 \
    --timeout 120 \
    --log-level debug \
    --access-logfile - \
    --error-logfile -
