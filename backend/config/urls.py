from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

API_PREFIX = "api/v1/"

urlpatterns = [
    path("admin/", admin.site.urls),
    # ─── JWT Auth ────────────────────────────────────────────────────────────
    path(f"{API_PREFIX}auth/token/", TokenObtainPairView.as_view(), name="token_obtain"),
    path(f"{API_PREFIX}auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(f"{API_PREFIX}auth/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # ─── Domain APIs ─────────────────────────────────────────────────────────
    path(f"{API_PREFIX}divisions/", include("apps.divisions.urls")),
    path(f"{API_PREFIX}products/", include("apps.products.urls")),
    path(f"{API_PREFIX}services/", include("apps.services.urls")),
    path(f"{API_PREFIX}certificates/", include("apps.certificates.urls")),
    path(f"{API_PREFIX}partners/", include("apps.partners.urls")),
    path(f"{API_PREFIX}projects/", include("apps.projects.urls")),
    path(f"{API_PREFIX}stats/", include("apps.stats.urls")),
    path(f"{API_PREFIX}pages/", include("apps.pages.urls")),
    path(f"{API_PREFIX}leads/", include("apps.leads.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
