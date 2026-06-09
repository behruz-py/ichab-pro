from rest_framework import serializers
from core.serializers import TranslatedSerializerMixin
from .models import Statistic


class StatisticSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    suffix = serializers.SerializerMethodField()

    class Meta:
        model = Statistic
        fields = ("id", "label", "value", "suffix", "icon", "order", "is_active")

    def get_label(self, obj):
        return self.get_t(obj, "label")

    def get_suffix(self, obj):
        return self.get_t(obj, "suffix")


class StatisticWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistic
        exclude = ("created_at", "updated_at")
