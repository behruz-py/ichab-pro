# -*- coding: utf-8 -*-
import sys
import io
from django.core.management.base import BaseCommand
from ._seed_divisions import seed_divisions
from ._seed_products import seed_products
from ._seed_services import seed_services
from ._seed_others import (
    seed_certificates, seed_partners, seed_projects, seed_stats, seed_pages
)


class Command(BaseCommand):
    help = "ICHAB uchun namuna ma'lumotlarini DB ga yozadi (idempotent)."

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Force UTF-8 stdout on Windows to avoid CP1252 encode errors
        if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Avval barcha ma'lumotlarni o'chiradi (EHTIYOT BO'LING!).",
        )

    def handle(self, *args, **options):
        if options["flush"]:
            self._flush()

        self.stdout.write(self.style.MIGRATE_HEADING("\n>>> Seed data boshlanmoqda...\n"))

        total, created = seed_divisions()
        self._log("Bo'linmalar (Divisions)", total, created)

        cats, cc, prods, pc = seed_products()
        self._log("Kategoriyalar (ProductCategory)", cats, cc)
        self._log("Mahsulotlar (Products)", prods, pc)

        total, created = seed_services()
        self._log("Xizmatlar (Services)", total, created)

        total, created = seed_certificates()
        self._log("Sertifikatlar", total, created)

        total, created = seed_partners()
        self._log("Hamkorlar (Partners)", total, created)

        total, created = seed_projects()
        self._log("Loyihalar (Projects)", total, created)

        total, created = seed_stats()
        self._log("Statistikalar", total, created)

        total, created = seed_pages()
        self._log("Sahifa kontentlari", total, created)

        self.stdout.write(self.style.SUCCESS("\n[OK] Seed data muvaffaqiyatli yozildi!\n"))

    def _log(self, name, total, created):
        updated = total - created
        self.stdout.write(
            f"  [+] {name}: "
            f"{self.style.SUCCESS(str(created))} yangi, "
            f"{updated} yangilangan"
        )

    def _flush(self):
        from apps.divisions.models import Division
        from apps.products.models import ProductCategory, Product
        from apps.services.models import Service
        from apps.certificates.models import Certificate
        from apps.partners.models import Partner
        from apps.projects.models import Project
        from apps.stats.models import Statistic
        from apps.pages.models import PageContent

        models = [Division, ProductCategory, Product, Service,
                  Certificate, Partner, Project, Statistic, PageContent]
        for m in models:
            count, _ = m.objects.all().delete()
            self.stdout.write(f"  Deleted {count} {m.__name__} records")
        self.stdout.write(self.style.WARNING("[!] Flush bajarildi.\n"))
