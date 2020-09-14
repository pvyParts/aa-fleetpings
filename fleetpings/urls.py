# -*- coding: utf-8 -*-

"""
pages url config
"""

from django.urls import path

from . import views


app_name = "fleetpings"

urlpatterns = [
    path("", views.index, name="index"),
]
