from .base import *  # noqa
from django.core.exceptions import ImproperlyConfigured

DEBUG = False

if SECRET_KEY == "unsafe-default-key":  # noqa — SECRET_KEY comes from base via *
    raise ImproperlyConfigured(
        "DJANGO_SECRET_KEY environment variable must be set in production."
    )

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_SSL_REDIRECT = False  # Set True behind HTTPS termination proxy
