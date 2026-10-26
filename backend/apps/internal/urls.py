from django.urls import path
from .views import InternalDatasetsView

urlpatterns = [
    path("datasets/", InternalDatasetsView.as_view(), name="internal-datasets"),
]
