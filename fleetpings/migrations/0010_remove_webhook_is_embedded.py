# Generated by Django 4.0.3 on 2022-04-16 14:01

# Django
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("fleetpings", "0009_remove_webhook_type"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="webhook",
            name="is_embedded",
        ),
    ]
