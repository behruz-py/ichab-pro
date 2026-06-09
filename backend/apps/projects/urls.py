from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ProjectImageViewSet

router = DefaultRouter()
router.register("images", ProjectImageViewSet, basename="project-image")
router.register("", ProjectViewSet, basename="project")

urlpatterns = [
    path("", include(router.urls)),
]
