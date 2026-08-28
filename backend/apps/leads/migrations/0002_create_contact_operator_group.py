from django.db import migrations


GROUP_NAME = "Aloqa operatori"


def create_group(apps, schema_editor):
    """
    Creates a restricted group meant for a contact-desk operator: it can
    only see and update Leads (view + change — no add, no delete; the admin
    itself also blocks add/delete regardless of permissions, see
    apps/leads/admin.py). Assign a staff user to this group in
    /admin/auth/user/ to give them a scoped-down "just the inbox" admin —
    the sidebar navigation hides every other section for non-superusers.

    Permission rows are created explicitly here (get_or_create) rather than
    just queried, because Django's auto-creation of default model
    permissions runs on the post_migrate signal — which only fires once
    *after* an entire `migrate` run finishes. On a brand-new database this
    migration applies in the same run as leads.0001_initial, so the
    auto-created "view_lead"/"change_lead" permissions wouldn't exist yet
    if we merely queried for them.
    """
    Group = apps.get_model("auth", "Group")
    Permission = apps.get_model("auth", "Permission")
    ContentType = apps.get_model("contenttypes", "ContentType")

    content_type, _ = ContentType.objects.get_or_create(app_label="leads", model="lead")

    perms = []
    for codename, name in [
        ("view_lead", "Can view murojaat"),
        ("change_lead", "Can change murojaat"),
    ]:
        perm, _ = Permission.objects.get_or_create(
            content_type=content_type, codename=codename, defaults={"name": name}
        )
        perms.append(perm)

    group, _ = Group.objects.get_or_create(name=GROUP_NAME)
    group.permissions.set(perms)


def remove_group(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    Group.objects.filter(name=GROUP_NAME).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("leads", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_group, remove_group),
    ]
