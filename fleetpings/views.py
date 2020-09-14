# -*- coding: utf-8 -*-

"""
the views
"""

from fleetpings.models import (
    FleetComm,
    DiscordPingTargets,
    FleetType,
    Webhook,
    FleetDoctrine,
    FormupLocation,
)

from django.shortcuts import render
from django.contrib.auth.decorators import login_required, permission_required

from . import __title__

from .app_settings import (
    AA_FLEETPINGS_USE_SLACK,
    get_site_url,
    timezones_installed,
)


@login_required
@permission_required("fleetpings.basic_access")
def index(request):
    """
    Index view
    """
    fleet_comms = FleetComm.objects.filter(is_enabled=True).order_by("name")

    used_platform = "Discord"
    if AA_FLEETPINGS_USE_SLACK is True:
        used_platform = "Slack"

    # get the webhooks for the used platform
    webhooks = (
        Webhook.objects.filter(
            type=used_platform,
            restricted_to_group__in=request.user.groups.all(),
            is_enabled=True,
        )
        .distinct()
        .order_by("name")
    )

    # get additional ping targets for discord
    additional_discord_ping_targets = {}
    if AA_FLEETPINGS_USE_SLACK is False:
        additional_discord_ping_targets = (
            DiscordPingTargets.objects.filter(
                restricted_to_group__in=request.user.groups.all(), is_enabled=True
            )
            .distinct()
            .order_by("name")
        )

    # get fleet types
    fleet_types = FleetType.objects.filter(is_enabled=True).order_by("name")

    # get doctrines
    doctrines = FleetDoctrine.objects.filter(is_enabled=True).order_by("name")

    # get formup locations
    formup_locations = FormupLocation.objects.filter(is_enabled=True).order_by("name")

    context = {
        "title": __title__,
        "additionalPingTargets": additional_discord_ping_targets,
        "additionalFleetTypes": fleet_types,
        "additionalPingWebhooks": webhooks,
        "fleetComms": fleet_comms,
        "fleetDoctrines": doctrines,
        "fleetFormupLocations": formup_locations,
        "site_url": get_site_url(),
        "timezones_installed": timezones_installed(),
        "mainCharacter": request.user.profile.main_character,
        "useSlack": AA_FLEETPINGS_USE_SLACK,
    }

    return render(request, "fleetpings/index.html", context)
