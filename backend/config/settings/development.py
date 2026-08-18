from .base import *  # noqa

DEBUG = True

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] += [  # noqa
    "rest_framework.renderers.BrowsableAPIRenderer",
]

# django_extensions ixtiyoriy — mavjud bo'lsa qo'shiladi
try:
    import django_extensions  # noqa
    INSTALLED_APPS += ["django_extensions"]  # noqa
except ImportError:
    pass
