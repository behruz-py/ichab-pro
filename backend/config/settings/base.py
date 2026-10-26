from pathlib import Path
from decouple import config
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config("DJANGO_SECRET_KEY", default="unsafe-default-key")
DEBUG = config("DJANGO_DEBUG", default=False, cast=bool)
ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default="localhost,127.0.0.1").split(",")
# Auto-domain injected by the hosting platform — Railway's and Render's env
# var names differ, so check both; whichever platform is actually running
# this sets its own var and leaves the other unset.
_platform_host = config("RAILWAY_PUBLIC_DOMAIN", default="") or config("RENDER_EXTERNAL_HOSTNAME", default="")
if _platform_host:
    ALLOWED_HOSTS.append(_platform_host)
    CSRF_TRUSTED_ORIGINS = [f"https://{_platform_host}"]

# Both Railway and Render terminate SSL at the proxy level
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

DJANGO_APPS = [
    "unfold",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
]

LOCAL_APPS = [
    "apps.divisions",
    "apps.products",
    "apps.services",
    "apps.certificates",
    "apps.partners",
    "apps.projects",
    "apps.stats",
    "apps.pages",
    "apps.leads",
    "apps.internal",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# ─── Database ──────────────────────────────────────────────────────────────────
# Railway provides DATABASE_URL; fallback to individual vars for local/Docker
_db_url = config("DATABASE_URL", default="")
if _db_url:
    import dj_database_url
    DATABASES = {"default": dj_database_url.parse(_db_url, conn_max_age=600)}
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": config("POSTGRES_DB", default="ichab_db"),
            "USER": config("POSTGRES_USER", default="ichab_user"),
            "PASSWORD": config("POSTGRES_PASSWORD", default="ichab_pass"),
            "HOST": config("POSTGRES_HOST", default="localhost"),
            "PORT": config("POSTGRES_PORT", default="5432"),
        }
    }

# ─── Cache ─────────────────────────────────────────────────────────────────────
# In-process cache — only used for DRF's lead-submission rate limiting (see
# apps.leads.views), which doesn't need to be shared across processes for a
# single-instance deployment. No Redis service to host/pay for as a result.
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# ─── Auth ──────────────────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ─── i18n ──────────────────────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

# ─── Static & Media ────────────────────────────────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media (uploaded images/files): local disk by default (dev, or any host with
# a persistent volume). Set the AWS_* vars below to serve media from an
# S3-compatible bucket instead — e.g. Cloudflare R2 — for hosts with no
# persistent disk (Render's free tier, Cloud Run, etc). R2's free tier has no
# egress fees, unlike S3.
AWS_STORAGE_BUCKET_NAME = config("AWS_STORAGE_BUCKET_NAME", default="")
# Django 5.1 removed DEFAULT_FILE_STORAGE / STATICFILES_STORAGE — they are
# silently ignored, so storage backends must be declared via STORAGES.
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage" if AWS_STORAGE_BUCKET_NAME
        else "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}
if AWS_STORAGE_BUCKET_NAME:
    AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID", default="")
    AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY", default="")
    AWS_S3_ENDPOINT_URL = config("AWS_S3_ENDPOINT_URL", default="")  # e.g. https://<account_id>.r2.cloudflarestorage.com
    AWS_S3_CUSTOM_DOMAIN = config("AWS_S3_CUSTOM_DOMAIN", default="")  # e.g. a public R2.dev or custom media subdomain, no scheme
    AWS_DEFAULT_ACL = None  # R2/S3 bucket-level public access policy handles this, not per-object ACLs
    AWS_S3_FILE_OVERWRITE = False
    AWS_QUERYSTRING_AUTH = False  # public bucket — plain URLs, no signed-query noise
    AWS_S3_ADDRESSING_STYLE = "virtual"
    MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/" if AWS_S3_CUSTOM_DOMAIN else "/media/"
else:
    MEDIA_URL = "/media/"
    MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ─── DRF ───────────────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    # Throttling is applied selectively (see apps.leads.views) — NOT globally,
    # because all SSR read traffic originates from the Next.js server's single IP
    # and a global AnonRateThrottle would throttle the whole site.
    "DEFAULT_THROTTLE_RATES": {
        "lead": "10/hour",
        "login": "10/minute",
    },
}

# ─── JWT ───────────────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=config("JWT_ACCESS_TOKEN_LIFETIME_MINUTES", default=60, cast=int)
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=config("JWT_REFRESH_TOKEN_LIFETIME_DAYS", default=7, cast=int)
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ─── CORS ──────────────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS", default="http://localhost:3000"
).split(",")
CORS_ALLOW_CREDENTIALS = True
# Also allow Vercel preview deployments (random *.vercel.app subdomains) so a
# preview build of the frontend can submit the contact form without a CORS
# error. Low risk: the only browser-submitted write this unlocks is the public
# lead endpoint, which is AllowAny and header-based (no cookies to leak).
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
]

# ─── Email ─────────────────────────────────────────────────────────────────────
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL", default="no-reply@ichab.uz")

# ─── Telegram ──────────────────────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN = config("TELEGRAM_BOT_TOKEN", default="")
TELEGRAM_CHAT_ID = config("TELEGRAM_CHAT_ID", default="")

# ─── Lead notifications ────────────────────────────────────────────────────────
# Optional: if set, new leads are also emailed here (in addition to Telegram).
LEAD_NOTIFY_EMAIL_TO = config("LEAD_NOTIFY_EMAIL_TO", default="")

# ─── Unfold Admin ───────────────────────────────────────────────────────────────
UNFOLD = {
    "SITE_TITLE": "Ichab Pro",
    "SITE_HEADER": "Ichab Pro Admin",
    "SITE_URL": "/",
    "SITE_ICON": None,
    "SITE_LOGO": None,
    "SITE_SYMBOL": "settings",
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": True,
    "THEME": "dark",
    "COLORS": {
        "primary": {
            "50": "240 249 255",
            "100": "224 242 254",
            "200": "186 230 253",
            "300": "125 211 252",
            "400": "56 189 248",
            "500": "14 165 233",
            "600": "2 132 199",
            "700": "3 105 161",
            "800": "7 89 133",
            "900": "12 74 110",
            "950": "8 47 73",
        },
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {},
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": "Asosiy",
                "items": [
                    {
                        "title": "Foydalanuvchilar",
                        "icon": "people",
                        "link": "/admin/auth/user/",
                        "permission": lambda request: request.user.is_superuser,
                    },
                ],
            },
            {
                "title": "Kontent",
                "items": [
                    {"title": "Bo'linmalar", "icon": "apartment", "link": "/admin/divisions/division/", "permission": lambda request: request.user.is_superuser},
                    {"title": "Mahsulotlar", "icon": "inventory_2", "link": "/admin/products/product/", "permission": lambda request: request.user.is_superuser},
                    {"title": "Xizmatlar", "icon": "build", "link": "/admin/services/service/", "permission": lambda request: request.user.is_superuser},
                    {"title": "Loyihalar", "icon": "construction", "link": "/admin/projects/project/", "permission": lambda request: request.user.is_superuser},
                    {"title": "Hamkorlar", "icon": "handshake", "link": "/admin/partners/partner/", "permission": lambda request: request.user.is_superuser},
                    {"title": "Sertifikatlar", "icon": "workspace_premium", "link": "/admin/certificates/certificate/", "permission": lambda request: request.user.is_superuser},
                    {"title": "Statistika", "icon": "bar_chart", "link": "/admin/stats/statistic/", "permission": lambda request: request.user.is_superuser},
                    {"title": "Sahifalar", "icon": "article", "link": "/admin/pages/pagecontent/", "permission": lambda request: request.user.is_superuser},
                    # Visible to anyone with view access to Lead — i.e. superusers
                    # AND the restricted "Aloqa operatori" account (see the
                    # create_contact_operator_group migration in apps/leads).
                    {"title": "Murojaatlar", "icon": "mail", "link": "/admin/leads/lead/", "permission": lambda request: request.user.has_perm("leads.view_lead")},
                ],
            },
        ],
    },
}
