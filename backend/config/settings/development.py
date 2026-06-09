from .base import *  # noqa

DEBUG = True

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] += [  # noqa
    "rest_framework.renderers.BrowsableAPIRenderer",
]

INSTALLED_APPS += ["django_extensions"]  # noqa — optional dev tool
