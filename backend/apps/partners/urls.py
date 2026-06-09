from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet

router = DefaultRouter()
router.register("", PartnerViewSet, basename="partner")

urlpatterns = [
    path("", include(router.urls)),
]
