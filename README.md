# AA Fleet Pings

[![Version](https://img.shields.io/pypi/v/aa-fleetpings?label=release)](https://pypi.org/project/aa-fleetpings/)
[![License](https://img.shields.io/github/license/ppfeufer/aa-fleetpings)](https://github.com/ppfeufer/aa-fleetpings/blob/master/LICENSE)
[![Python](https://img.shields.io/pypi/pyversions/aa-fleetpings)](https://pypi.org/project/aa-fleetpings/)
[![Django](https://img.shields.io/pypi/djversions/aa-fleetpings?label=django)](https://pypi.org/project/aa-fleetpings/)
![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white)
[![Code Style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](http://black.readthedocs.io/en/latest/)
[![Discord](https://img.shields.io/discord/790364535294132234?label=discord)](https://discord.gg/zmh52wnfvM)
[![Checks](https://github.com/ppfeufer/aa-fleetpings/actions/workflows/automated-checks.yml/badge.svg)](https://github.com/ppfeufer/aa-fleetpings/actions/workflows/automated-checks.yml)
[![codecov](https://codecov.io/gh/ppfeufer/aa-fleetpings/branch/master/graph/badge.svg?token=9I6HQB6W6J)](https://codecov.io/gh/ppfeufer/aa-fleetpings)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://github.com/ppfeufer/aa-fleetpings/blob/master/CODE_OF_CONDUCT.md)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/N4N8CL1BY)

App for Alliance Auth that can format your fleet pings and also ping for you to
Discord.


<!-- TOC -->
* [AA Fleet Pings](#aa-fleet-pings)
  * [Installation](#installation)
    * [⚠️ Important ⚠️](#-important-)
    * [Step 1: Install the App](#step-1-install-the-app)
    * [Step 2: Update Your AA Settings](#step-2-update-your-aa-settings)
    * [Step 3: Finalizing the Installation](#step-3-finalizing-the-installation)
    * [Step 4: Setting up Permission](#step-4-setting-up-permission)
    * [Step 5: Setting up the App](#step-5-setting-up-the-app)
  * [Updating](#updating)
  * [Screenshots](#screenshots)
    * [View in Alliance Auth](#view-in-alliance-auth)
    * [Discord Ping Example](#discord-ping-example)
  * [Configuration](#configuration)
    * [Use Doctrines From Fittings Module](#use-doctrines-from-fittings-module)
    * [Allow Non Discord Webhooks](#allow-non-discord-webhooks)
  * [Changelog](#changelog)
  * [Contributing](#contributing)
<!-- TOC -->


## Installation

### ⚠️ Important ⚠️

This app is a plugin for Alliance Auth. If you don't have Alliance Auth running already,
please install it first before proceeding. (See the official [AA installation guide]
for details)

**⚠️ You also want to make sure that you have the [Discord service] installed,
configured and activated before installing this app. ⚠️**

### Step 1: Install the App

Make sure you're in the virtual environment (venv) of your Alliance Auth installation.
Then install the latest version:

```bash
pip install aa-fleetpings
```

### Step 2: Update Your AA Settings

Configure your AA settings (`local.py`) as follows:

- Add `'fleetpings',` to `INSTALLED_APPS`


### Step 3: Finalizing the Installation

Copy static files and run migrations

```bash
python manage.py collectstatic
python manage.py migrate
```

Restart your supervisor services for AA

### Step 4: Setting up Permission

Now you can set up permissions in Alliance Auth for your users.
Add ``fleetpings | aa fleetpings | Can access this app`` to the states and/or
groups you would like to have access.

### Step 5: Setting up the App

In your admin backend you'll find a new section called `Fleet Pings`.
This is where you set all your stuff up, like the webhooks you want to ping and who
can ping them, fleet types, comms, formup locations, and so on. It's pretty straight
forward, so you shouldn't have any issues. Go nuts!


## Updating

To update your existing installation of AA Discord Ping Formatter, first enable your
virtual environment.

Then run the following commands from your AA project directory (the one that
contains `manage.py`).

```bash
pip install -U aa-fleetpings

python manage.py collectstatic
python manage.py migrate
```

Finally, restart your AA supervisor services.


## Screenshots

### View in Alliance Auth

![View in Alliance Auth](https://raw.githubusercontent.com/ppfeufer/aa-fleetpings/master/fleetpings/docs/images/aa-view.jpg "View in Alliance Auth")

### Discord Ping Example

![Discord Ping Example](https://raw.githubusercontent.com/ppfeufer/aa-fleetpings/master/fleetpings/docs/images/discord-ping.jpg "Discord Ping Example")


## Configuration

The following settings can be made in your `local.py`:

| Setting                                            | Description                                                                             | Default |
|:---------------------------------------------------|:----------------------------------------------------------------------------------------|:--------|
| `AA_FLEETPINGS_USE_DOCTRINES_FROM_FITTINGS_MODULE` | Enables integration with the [Fittings and Doctrines] module for doctrine suggestion.   | `False` |
| `AA_FLEETPINGS_WEBHOOK_VERIFICATION`               | Enables or disables verification of webhook URLs to see if it's a valid Discord webhook | `True`  |


### Use Doctrines From Fittings Module

If you have the [Fittings and Doctrines] module installed, and your doctrines
configured there, you don't have to re-build your doctrine list for this module. You
can simply use the doctrines you already have configured in the Fittings and
Doctrines module.

To do so, add the following to your `local.py`:

```python
## AA Fleet Pings
AA_FLEETPINGS_USE_DOCTRINES_FROM_FITTINGS_MODULE = True
```

### Allow Non Discord Webhooks

If you require your pings to be sent to a webhook that is not a standard discord
webhook, add the following to your `local.py`:

```python
## AA Fleet Pings
AA_FLEETPINGS_WEBHOOK_VERIFICATION = False
```

When disabling webhook verification and using non Discord webhooks, it is up to you
to make sure your webhook understands a payload that is formatted for Discord webhooks.

<!-- URLs -->
[Fittings and Doctrines]: https://gitlab.com/colcrunch/fittings "Fittings and Doctrines"
[Discord service]: https://allianceauth.readthedocs.io/en/latest/features/services/discord.html "Discord service"
[AA installation guide]: https://allianceauth.readthedocs.io/en/latest/installation/allianceauth.html "AA installation guide"


## Changelog

See [CHANGELOG.md](https://github.com/ppfeufer/aa-fleetpings/blob/master/CHANGELOG.md)


## Contributing

You want to contribute to this project? That's cool!

Please make sure to read the [Contribution Guidelines](https://github.com/ppfeufer/aa-fleetpings/blob/master/CONTRIBUTING.md)
(I promise, it's not much, just some basics)
