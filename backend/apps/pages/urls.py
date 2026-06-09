from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PageContentViewSet

router = DefaultRouter()
router.register("", PageContentViewSet, basename="page-content")

urlpatterns = [
    path("", include(router.urls)),
]
