from .base import *  # noqa

DEBUG = True

# SQLite — PostgreSQL o'rniga, local ishga tushirish uchun
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "local_dev.sqlite3",  # noqa
    }
}

# Redis o'rniga xotira cache
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# django_extensions ixtiyoriy — mavjud bo'lsa qo'shiladi
try:
    import django_extensions  # noqa
    INSTALLED_APPS += ["django_extensions"]  # noqa
except ImportError:
    pass

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] += [  # noqa
    "rest_framework.renderers.BrowsableAPIRenderer",
]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
