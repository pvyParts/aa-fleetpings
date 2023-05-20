# Generated by Django 2.2.16 on 2020-09-15 16:17

# Django
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("fleetpings", "0003_fleetdoctrine_link"),
    ]

    operations = [
        migrations.AlterField(
            model_name="discordpingtargets",
            name="restricted_to_group",
            field=models.ManyToManyField(
                blank=True,
                help_text="Restrict ping rights to the following group(s) ...",
                related_name="discord_role_require_groups",
                to="auth.Group",
            ),
        ),
        migrations.AlterField(
            model_name="webhook",
            name="restricted_to_group",
            field=models.ManyToManyField(
                blank=True,
                help_text="Restrict ping rights to the following group(s) ...",
                related_name="webhook_require_groups",
                to="auth.Group",
            ),
        ),
    ]
