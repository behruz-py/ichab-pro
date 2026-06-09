from rest_framework import serializers


SUPPORTED_LANGS = ("uz", "ru", "en")


class TranslatedSerializerMixin:
    """
    Adds `get_t(obj, field)` — returns the correct language value based on
    `?lang=uz|ru|en` query param (defaults to 'uz').
    Use with SerializerMethodField in subclasses.
    """

    def _lang(self) -> str:
        request = self.context.get("request")
        if request:
            lang = request.query_params.get("lang", "uz")
            return lang if lang in SUPPORTED_LANGS else "uz"
        return "uz"

    def get_t(self, obj, field: str) -> str:
        return obj.translate(field, self._lang())


class ImageFieldAbsoluteURL(serializers.ImageField):
    """ImageField that always returns an absolute URL."""

    def to_representation(self, value):
        if not value:
            return None
        request = self.context.get("request")
        url = value.url
        if request:
            return request.build_absolute_uri(url)
        return url


class FileFieldAbsoluteURL(serializers.FileField):
    """FileField that always returns an absolute URL."""

    def to_representation(self, value):
        if not value:
            return None
        request = self.context.get("request")
        url = value.url
        if request:
            return request.build_absolute_uri(url)
        return url
