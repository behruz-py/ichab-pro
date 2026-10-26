from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
from apps.internal.views import StaffTokenObtainView, MeView

API_PREFIX = "api/v1/"

urlpatterns = [
    path("admin/", admin.site.urls),
    # ─── JWT Auth ────────────────────────────────────────────────────────────
    path(f"{API_PREFIX}auth/token/", StaffTokenObtainView.as_view(), name="token_obtain"),
    path(f"{API_PREFIX}auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(f"{API_PREFIX}auth/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path(f"{API_PREFIX}auth/me/", MeView.as_view(), name="auth_me"),
    path(f"{API_PREFIX}internal/", include("apps.internal.urls")),
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

# Always serve media files (Railway persistent volume at /app/media)
urlpatterns += [
    path("media/<path:path>", serve, {"document_root": settings.MEDIA_ROOT}),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
