# Generated by Django 2.2.16 on 2020-09-14 16:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0011_update_proxy_permissions"),
    ]

    operations = [
        migrations.CreateModel(
            name="AaFleetpings",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
            ],
            options={
                "permissions": (("basic_access", "Can access this app"),),
                "managed": False,
                "default_permissions": (),
            },
        ),
        migrations.CreateModel(
            name="FleetComm",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Short name to identify this comms",
                        max_length=255,
                        unique=True,
                    ),
                ),
                (
                    "notes",
                    models.TextField(
                        blank=True,
                        help_text="You can add notes about this configuration here if you want",
                        null=True,
                    ),
                ),
                (
                    "is_enabled",
                    models.BooleanField(
                        db_index=True,
                        default=True,
                        help_text="Whether this comms is enabled or not",
                    ),
                ),
            ],
            options={
                "verbose_name": "Fleet Comm",
                "verbose_name_plural": "Fleet Comms",
                "default_permissions": (),
            },
        ),
        migrations.CreateModel(
            name="FleetDoctrine",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Short name to identify this doctrine",
                        max_length=255,
                        unique=True,
                    ),
                ),
                (
                    "notes",
                    models.TextField(
                        blank=True,
                        help_text="You can add notes about this configuration here if you want",
                        null=True,
                    ),
                ),
                (
                    "is_enabled",
                    models.BooleanField(
                        db_index=True,
                        default=True,
                        help_text="Whether this doctrine is enabled or not",
                    ),
                ),
            ],
            options={
                "verbose_name": "Fleet Doctrine",
                "verbose_name_plural": "Fleet Doctrines",
                "default_permissions": (),
            },
        ),
        migrations.CreateModel(
            name="FleetType",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Short name to identify this fleet type",
                        max_length=255,
                        unique=True,
                    ),
                ),
                (
                    "embed_color",
                    models.CharField(
                        blank=True,
                        help_text="Hightlight color for the embed",
                        max_length=7,
                    ),
                ),
                (
                    "notes",
                    models.TextField(
                        blank=True,
                        help_text="You can add notes about this configuration here if you want",
                        null=True,
                    ),
                ),
                (
                    "is_enabled",
                    models.BooleanField(
                        db_index=True,
                        default=True,
                        help_text="Whether this fleet type is enabled or not",
                    ),
                ),
            ],
            options={
                "verbose_name": "Fleet Type",
                "verbose_name_plural": "Fleet Types",
                "default_permissions": (),
            },
        ),
        migrations.CreateModel(
            name="FormupLocation",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Short name to identify this formup location",
                        max_length=255,
                        unique=True,
                    ),
                ),
                (
                    "notes",
                    models.TextField(
                        blank=True,
                        help_text="You can add notes about this configuration here if you want",
                        null=True,
                    ),
                ),
                (
                    "is_enabled",
                    models.BooleanField(
                        db_index=True,
                        default=True,
                        help_text="Whether this formup location is enabled or not",
                    ),
                ),
            ],
            options={
                "verbose_name": "Formup Location",
                "verbose_name_plural": "Formup Locations",
                "default_permissions": (),
            },
        ),
        migrations.CreateModel(
            name="Webhook",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[("Discord", "Discord"), ("Slack", "Slack")],
                        default="Discord",
                        help_text="Is this a Discord or Slack webhook?",
                        max_length=7,
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Name of the channel this webhook posts to",
                        max_length=255,
                        unique=True,
                    ),
                ),
                (
                    "url",
                    models.CharField(
                        help_text="URL of this webhook, e.g. https://discordapp.com/api/webhooks/123456/abcdef or https://hooks.slack.com/services/xxxx/xxxx",
                        max_length=255,
                        unique=True,
                    ),
                ),
                (
                    "is_embedded",
                    models.BooleanField(
                        db_index=True,
                        default=True,
                        help_text="Whether this webhook's ping is embedded or not. This setting only effects Discord webhooks.",
                    ),
                ),
                (
                    "notes",
                    models.TextField(
                        blank=True,
                        help_text="You can add notes about this webhook here if you want",
                        null=True,
                    ),
                ),
                (
                    "is_enabled",
                    models.BooleanField(
                        db_index=True,
                        default=True,
                        help_text="Whether this webhook is active or not",
                    ),
                ),
                (
                    "restricted_to_group",
                    models.ManyToManyField(
                        help_text="Restrict ping rights to the following group(s) ...",
                        related_name="webhook_require_groups",
                        to="auth.Group",
                    ),
                ),
            ],
            options={
                "verbose_name": "Webhook",
                "verbose_name_plural": "Webhooks",
                "default_permissions": (),
            },
        ),
        migrations.CreateModel(
            name="DiscordPingTargets",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "discord_id",
                    models.CharField(
                        blank=True,
                        help_text="ID of the Discord role to ping",
                        max_length=255,
                        unique=True,
                    ),
                ),
                (
                    "notes",
                    models.TextField(
                        blank=True,
                        help_text="You can add notes about this configuration here if you want",
                        null=True,
                    ),
                ),
                (
                    "is_enabled",
                    models.BooleanField(
                        db_index=True,
                        default=True,
                        help_text="Whether this formup location is enabled or not",
                    ),
                ),
                (
                    "name",
                    models.OneToOneField(
                        help_text="Name of the Discord role to ping. (Note: This must be an Auth group that is synched to Discord.)",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="auth.Group",
                    ),
                ),
                (
                    "restricted_to_group",
                    models.ManyToManyField(
                        help_text="Restrict ping rights to the following group(s) ...",
                        related_name="discord_role_require_groups",
                        to="auth.Group",
                    ),
                ),
            ],
            options={
                "verbose_name": "Discord Ping Target",
                "verbose_name_plural": "Discord Ping Targets",
                "default_permissions": (),
            },
        ),
    ]
