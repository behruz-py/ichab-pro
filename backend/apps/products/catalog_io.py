"""Whole-product import/export in one trilingual JSON document.

The same shape is used for both directions, so an export doubles as a backup
that can be re-imported unchanged. Used by the admin-only
``/products/import/`` and ``/products/<slug>/export/`` endpoints to enter the
catalogue from the department's source documents.

Shape (every key optional on import except ``slug`` and ``name_uz``)::

    {
      "slug": "...", "sku": "...", "brand": "...", "availability": "on_order",
      "order": 0, "is_active": true,
      "category": {"slug": "...", "name_uz": "...", "name_ru": "...", "name_en": "...", "icon": "..."},
      "name_uz": "...", ... (name/short_description/description/meta_* × uz/ru/en),
      "specs": [{"label_uz": "...", "label_ru": "...", "label_en": "...", "value": "...", "unit": ""}],
      "variant_table": {"parameters": [{"label_uz": "...", "unit": ""}],
                        "variants": [{"code": "...", "values": ["...", "..."]}]},
      "images": [{"path": "products/images/x.png" | "file": "<multipart field>",
                  "is_main": true, "alt_uz": "..."}]
    }

``specs``, ``variant_table`` and ``images`` replace what the product had when
present and are left untouched when absent.
"""
from django.core.files.storage import default_storage
from django.db import transaction

from .models import (
    Product, ProductCategory, ProductImage, ProductParameter,
    ProductSpecification, ProductVariant, ProductVariantValue,
)

LANGS = ("uz", "ru", "en")
TRANSLATED = ("name", "short_description", "description", "meta_title", "meta_description")
PLAIN = ("sku", "brand", "availability", "order", "is_active")


class ImportError_(ValueError):
    """Raised for a payload that cannot be applied; the message is user-facing."""


def _tr(obj, field):
    return {f"{field}_{l}": getattr(obj, f"{field}_{l}") for l in LANGS}


def export_product(p: Product) -> dict:
    data = {"slug": p.slug, **{k: getattr(p, k) for k in PLAIN}}
    if p.category_id:
        c = p.category
        data["category"] = {"slug": c.slug, **_tr(c, "name"), "icon": c.icon, "order": c.order}
    for f in TRANSLATED:
        data.update(_tr(p, f))
    data["specs"] = [{**_tr(s, "label"), "value": s.value, "unit": s.unit} for s in p.specs.order_by("order", "id")]
    params = list(p.parameters.order_by("order", "id"))
    if params:
        variants = []
        for v in p.variants.order_by("order", "id").prefetch_related("values"):
            by_param = {val.parameter_id: val.value for val in v.values.all()}
            variants.append({"code": v.code, "values": [by_param.get(pa.id, "") for pa in params]})
        data["variant_table"] = {"parameters": [{**_tr(pa, "label"), "unit": pa.unit} for pa in params], "variants": variants}
    data["images"] = [
        {"path": i.image.name, "is_main": i.is_main, **_tr(i, "alt")}
        for i in p.images.order_by("order", "id")
    ]
    return data


def _pick(d, keys):
    return {k: d[k] for k in keys if k in d}


@transaction.atomic
def import_product(data: dict, files=None) -> tuple[Product, bool]:
    files = files or {}
    slug = (data.get("slug") or "").strip()
    if not slug or not data.get("name_uz"):
        raise ImportError_("'slug' and 'name_uz' are required.")
    tr_keys = [f"{f}_{l}" for f in TRANSLATED for l in LANGS]

    fields = _pick(data, list(PLAIN) + tr_keys)
    if "availability" in fields and fields["availability"] not in Product.Availability.values:
        raise ImportError_(f"Unknown availability {fields['availability']!r}.")

    if "category" in data:
        c = data["category"]
        if c is None:
            fields["category"] = None
        else:
            if not c.get("slug"):
                raise ImportError_("category.slug is required.")
            cat, _ = ProductCategory.objects.get_or_create(slug=c["slug"], defaults={"name_uz": c.get("name_uz") or c["slug"]})
            for k, v in _pick(c, [f"name_{l}" for l in LANGS] + ["icon", "order"]).items():
                setattr(cat, k, v)
            cat.save()
            fields["category"] = cat

    product, created = Product.objects.update_or_create(slug=slug, defaults=fields)

    if "specs" in data:
        product.specs.all().delete()
        ProductSpecification.objects.bulk_create([
            ProductSpecification(product=product, order=i, value=s["value"], unit=s.get("unit", ""),
                                 **_pick(s, [f"label_{l}" for l in LANGS]))
            for i, s in enumerate(data["specs"])
        ])

    if "variant_table" in data:
        product.parameters.all().delete()  # cascades to the cell values
        product.variants.all().delete()
        table = data["variant_table"] or {}
        params = [
            ProductParameter.objects.create(product=product, order=i, unit=pa.get("unit", ""),
                                            **_pick(pa, [f"label_{l}" for l in LANGS]))
            for i, pa in enumerate(table.get("parameters", []))
        ]
        for i, v in enumerate(table.get("variants", [])):
            vals = v.get("values", [])
            if len(vals) != len(params):
                raise ImportError_(f"Variant {v.get('code')!r} has {len(vals)} values for {len(params)} parameters.")
            variant = ProductVariant.objects.create(product=product, code=v["code"], order=i)
            ProductVariantValue.objects.bulk_create([
                ProductVariantValue(variant=variant, parameter=pa, value=val) for pa, val in zip(params, vals)
            ])

    if "images" in data:
        rows = []
        for i, img in enumerate(data["images"]):
            if img.get("file"):
                upload = files.get(img["file"])
                if upload is None:
                    raise ImportError_(f"Image file {img['file']!r} was not uploaded.")
                src = upload
            elif img.get("path"):
                if not default_storage.exists(img["path"]):
                    raise ImportError_(f"Stored image {img['path']!r} does not exist.")
                src = img["path"]
            else:
                raise ImportError_("Each image needs 'file' or 'path'.")
            rows.append((src, img, i))
        product.images.all().delete()  # rows only; stored files are kept
        for src, img, i in rows:
            pi = ProductImage(product=product, order=i, is_main=bool(img.get("is_main")),
                              **_pick(img, [f"alt_{l}" for l in LANGS]))
            if isinstance(src, str):
                pi.image.name = src
                pi.save()
            else:
                pi.image.save(src.name, src, save=True)

    return product, created
