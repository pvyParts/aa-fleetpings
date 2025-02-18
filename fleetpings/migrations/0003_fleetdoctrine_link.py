# Generated by Django 2.2.16 on 2020-09-14 19:44

# Django
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("fleetpings", "0002_webhook_is_embed_description_change"),
    ]

    operations = [
        migrations.AddField(
            model_name="fleetdoctrine",
            name="link",
            field=models.CharField(
                blank=True,
                help_text="A link to a doctrine page for this doctrine if you have.",
                max_length=255,
            ),
        ),
    ]
