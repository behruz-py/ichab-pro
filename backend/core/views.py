from rest_framework import viewsets, permissions


class PublicReadAdminWriteMixin:
    """
    GET requests: anyone (public API).
    POST/PUT/PATCH/DELETE: admin only.
    """

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
