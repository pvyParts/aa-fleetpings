# -*- coding: utf-8 -*-

"""
our models
"""

from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.db import models

from allianceauth.services.modules.discord.models import DiscordUser


class AaFleetpings(models.Model):
    """Meta model for app permissions"""

    class Meta:
        """AaFleetpings :: Meta"""

        managed = False
        default_permissions = ()
        permissions = (("basic_access", "Can access this app"),)


# FleetComm Model
class FleetComm(models.Model):
    """Fleet Comms"""

    name = models.CharField(
        max_length=255, unique=True, help_text="Short name to identify this comms"
    )

    notes = models.TextField(
        null=True,
        default=None,
        blank=True,
        help_text="You can add notes about this configuration here if you want",
    )

    is_enabled = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Whether this comms is enabled or not",
    )

    def __str__(self) -> str:
        return str(self.name)

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id}, name='{self.name}')"

    class Meta:
        """FleetComm :: Meta"""

        verbose_name = "Fleet Comm"
        verbose_name_plural = "Fleet Comms"
        default_permissions = ()


# FleetDoctrine Model
class FleetDoctrine(models.Model):
    """Fleet Doctrine"""

    # doctrine name
    name = models.CharField(
        max_length=255, unique=True, help_text="Short name to identify this doctrine"
    )

    # doctrine notes
    notes = models.TextField(
        null=True,
        default=None,
        blank=True,
        help_text="You can add notes about this configuration here if you want",
    )

    # is doctrine active
    is_enabled = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Whether this doctrine is enabled or not",
    )

    def __str__(self) -> str:
        return str(self.name)

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id}, name='{self.name}')"

    class Meta:
        """FleetDoctrine :: Meta"""

        verbose_name = "Fleet Doctrine"
        verbose_name_plural = "Fleet Doctrines"
        default_permissions = ()


# FormupLocation Model
class FormupLocation(models.Model):
    """Formup Location"""

    # formup location name
    name = models.CharField(
        max_length=255,
        unique=True,
        help_text="Short name to identify this formup location",
    )

    # formup location notes
    notes = models.TextField(
        null=True,
        default=None,
        blank=True,
        help_text="You can add notes about this configuration here if you want",
    )

    # is formup location active
    is_enabled = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Whether this formup location is enabled or not",
    )

    def __str__(self) -> str:
        return str(self.name)

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id}, name='{self.name}')"

    class Meta:
        """FormupLocation :: Meta"""

        verbose_name = "Formup Location"
        verbose_name_plural = "Formup Locations"
        default_permissions = ()


# DiscordPingTargets Model
class DiscordPingTargets(models.Model):
    """Discord Ping Targets"""

    # discord group to ping
    name = models.OneToOneField(
        Group,
        on_delete=models.CASCADE,
        unique=True,
        help_text=(
            "Name of the Discord role to ping. "
            "(Note: This must be an Auth group that is synched to Discord.)"
        ),
    )

    # discord group id
    discord_id = models.CharField(
        max_length=255,
        unique=True,
        blank=True,
        help_text="ID of the Discord role to ping",
    )

    # restrictions
    restricted_to_group = models.ManyToManyField(
        Group,
        related_name="discord_role_require_groups",
        help_text="Restrict ping rights to the following group(s) ...",
    )

    # notes
    notes = models.TextField(
        null=True,
        default=None,
        blank=True,
        help_text="You can add notes about this configuration here if you want",
    )

    # is this group active
    is_enabled = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Whether this formup location is enabled or not",
    )

    def clean(self, *args, **kwargs):
        """
        check if the group has already been synched to Discord,
        if not, raise an error
        :param args:
        :param kwargs:
        """
        discord_group_info = DiscordUser.objects.group_to_role(self.name)

        if not discord_group_info:
            raise ValidationError("This group has not been synched to Discord yet.")

        super().clean(*args, **kwargs)

    def save(self, *args, **kwargs):
        """
        Add the Discord group ID and save the whole thing
        :param args:
        :param kwargs:
        """
        discord_group_info = DiscordUser.objects.group_to_role(self.name)
        self.discord_id = discord_group_info["id"]
        super().save(*args, **kwargs)  # Call the "real" save() method.

    def __str__(self) -> str:
        return str(self.name)

    def __repr__(self) -> str:
        return (
            f"{self.__class__.__name__}("
            f"id={self.id}, "
            f"discord_id='{self.discord_id}', "
            f"restricted_to_group='{self.restricted_to_group.all()}', "
            f"name='{self.name}'"
            f") "
        )

    class Meta:
        """DiscordPingTargets :: Meta"""

        verbose_name = "Discord Ping Target"
        verbose_name_plural = "Discord Ping Targets"
        default_permissions = ()


# FleetType Model
class FleetType(models.Model):
    """Fleet Types"""

    # name of the fleet type
    name = models.CharField(
        max_length=255,
        unique=True,
        help_text="Short name to identify this fleet type",
    )

    # embed color
    embed_color = models.CharField(
        max_length=7,
        blank=True,
        help_text="Hightlight color for the embed",
    )

    # fleet type notes
    notes = models.TextField(
        null=True,
        default=None,
        blank=True,
        help_text="You can add notes about this configuration here if you want",
    )

    # is this fleet type enabled
    is_enabled = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Whether this fleet type is enabled or not",
    )

    def __str__(self) -> str:
        return str(self.name)

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id}, name='{self.name}')"

    class Meta:
        """FleetType :: Meta"""

        verbose_name = "Fleet Type"
        verbose_name_plural = "Fleet Types"
        default_permissions = ()


# Webhook Model
class Webhook(models.Model):
    """A Discord or Slack webhook"""

    # webhook type choices
    WEBHOOK_TYPE_DISCORD = "Discord"
    WEBHOOK_TYPE_SLACK = "Slack"
    WEBHOOK_TYPE_CHOICES = (
        (WEBHOOK_TYPE_DISCORD, "Discord"),
        (WEBHOOK_TYPE_SLACK, "Slack"),
    )

    # webhook type
    type = models.CharField(
        max_length=7,
        choices=WEBHOOK_TYPE_CHOICES,
        default=WEBHOOK_TYPE_DISCORD,
        help_text="Is this a Discord or Slack webhook?",
    )

    # channel name
    name = models.CharField(
        max_length=255,
        unique=True,
        help_text="Name of the channel this webhook posts to",
    )

    # wehbook url
    url = models.CharField(
        max_length=255,
        unique=True,
        help_text=(
            "URL of this webhook, e.g. "
            "https://discordapp.com/api/webhooks/123456/abcdef "
            "or https://hooks.slack.com/services/xxxx/xxxx"
        ),
    )

    # embedded ping (only for discord wenhooks)
    is_embedded = models.BooleanField(
        default=True,
        db_index=True,
        help_text=(
            "Whether this webhook's ping is embedded or not. "
            "(This setting only effects Discord webhooks.)"
        ),
    )

    # restrictions
    restricted_to_group = models.ManyToManyField(
        Group,
        related_name="webhook_require_groups",
        help_text="Restrict ping rights to the following group(s) ...",
    )

    # webhook notes
    notes = models.TextField(
        null=True,
        default=None,
        blank=True,
        help_text="You can add notes about this webhook here if you want",
    )

    # is it enabled
    is_enabled = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Whether this webhook is active or not",
    )

    def __str__(self) -> str:
        return str(self.name)

    def __repr__(self) -> str:
        return (
            f"{self.__class__.__name__}("
            f"id={self.id}, "
            f"type='{self.type}', "
            f"url='{self.url}', "
            f"restricted_to_group='{self.restricted_to_group.all()}', "
            f"name='{self.name}', "
            f"is_embedded='{self.is_embedded}'"
            f")"
        )

    class Meta:
        """Webhook :: Meta"""

        verbose_name = "Webhook"
        verbose_name_plural = "Webhooks"
        default_permissions = ()
