from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import InternalDataset


class StaffTokenObtainView(TokenObtainPairView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "full_name": user.get_full_name() or user.username,
        })


class InternalDatasetsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({d.key: d.data for d in InternalDataset.objects.all()})
