/* global fleetpingsSettings, fleetpingsTranslations, ClipboardJS */

jQuery(document).ready(function ($) {
    'use strict';

    /* Functions
    ----------------------------------------------------------------------------------------------------------------- */
    /**
     * Convert line breaks into <br>
     *
     * @param {string} string
     * @param {bool} isXhtml
     */
    const nl2br = function (string, isXhtml) {
        const breakTag = isXhtml || typeof isXhtml === 'undefined' ? '<br />' : '<br>';

        return (string + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    };

    /**
     * Closing the message
     *
     * @param {string} element
     */
    const closeCopyMessageElement = function (element) {
        /**
         * Close after 10 seconds
         */
        $(element).fadeTo(10000, 500).slideUp(500, function () {
            $(this).slideUp(500, function () {
                $(this).remove();
            });
        });
    };

    /**
     * Show message when copy action was successful
     *
     * @param {string} message
     * @param {string} element
     */
    const showSuccess = function (message, element) {
        $(element).html(
            '<div class="alert alert-success alert-dismissable alert-copy-success">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message +
            '</div>'
        );

        closeCopyMessageElement('.alert-copy-success');
    };

    /**
     * Show message when copy action was not successful
     *
     * @param {string} message
     * @param {string} element
     */
    const showError = function (message, element) {
        $(element).html(
            '<div class="alert alert-danger alert-dismissable alert-copy-error">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message +
            '</div>'
        );

        closeCopyMessageElement('.alert-copy-error');
    };

    /**
     * Sanitize input string
     *
     * @param {string} input String to sanitize
     * @returns {string} Sanitized string
     */
    const sanitizeInput = function (input) {
        if (input) {
            return input
                .replace(
                    /<(|\/|[^>\/bi]|\/[^>bi]|[^\/>][^>]+|\/[^>][^>]+)>/g,
                    ''
                );
        } else {
            return input;
        }
    };

    /**
     * Escape input string
     *
     * @param {string} input String to escape
     * @param {boolean} quotesToEntities Transform quotes into entities
     * @returns {string} Escaped string
     */
    const escapeInput = function (input, quotesToEntities) {
        quotesToEntities = quotesToEntities || false;

        if (input) {
            let returnValue = sanitizeInput(input)
                .replace(
                    /&/g,
                    '&amp;'
                );

            if (quotesToEntities === true) {
                returnValue = returnValue.replace(
                    /"/g,
                    '&quot;'
                );
            }

            if (quotesToEntities === false) {
                returnValue = returnValue.replace(
                    /"/g,
                    '\\"'
                );
            }

            return returnValue;
        } else {
            return input;
        }
    };

    /**
     * Send an embedded message to a Discord webhook
     *
     * @param {string} webhookUrl Discord webhook URL
     * @param {string} content Message to send to Discord
     * @param {object} embeds Embedded content » https://discohook.org/ - https://leovoel.github.io/embed-visualizer/
     */
    const sendEmbeddedDiscordPing = function (webhookUrl, content, embeds) {
        const request = new XMLHttpRequest();

        request.open('POST', webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');

        const params = {
            username: '',
            avatar_url: '',
            content: content,
            embeds: [embeds]
        };

        request.send(JSON.stringify(params));
    };

    /**
     * Send a message to a Discord webhook
     *
     * @param {string} webhookUrl Discord webhook URL
     * @param {string} pingText Message to send to Discord
     */
    const sendDiscordPing = function (webhookUrl, pingText) {
        const request = new XMLHttpRequest();

        request.open('POST', webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');

        const params = {
            username: '',
            avatar_url: '',
            content: pingText
        };

        request.send(JSON.stringify(params));
    };

    /**
     * Send a message to a Slack webhook
     *
     * @param {string} webhookUrl Slack webhook URL
     * @param {object} payload Message to send to Slack
     */
    const sendSlackPing = function (webhookUrl, payload) {
        $.ajax({
            data: 'payload=' + JSON.stringify(payload),
            dataType: 'json',
            processData: false,
            type: 'POST',
            url: webhookUrl
        });
    };

    /**
     * Convert hex color code in something Discord can handle
     *
     * @param {string} hexValue
     */
    const hexToDecimal = function (hexValue) {
        return parseInt(hexValue.replace('#', ''), 16);
    };

    /**
     * Convert the datepicker info into an URL that the aa-timezones module understands
     *
     * @param {string} formupTime
     */
    const getTimezonesUrl = function (formupTime) {
        const formupDateTime = new Date(formupTime);
        const formupTimestamp = (formupDateTime.getTime() - formupDateTime.getTimezoneOffset() * 60 * 1000) / 1000;

        return fleetpingsSettings.siteUrl + 'timezones/' + formupTimestamp + '/';
    };

    /**
     * Create the ping text
     *
     * @param {string} fleetSrpCode SRP code for the fleet, if available
     */
    const generateFleetPing = function (fleetSrpCode) {
        const pingTargetSelected = $('select#pingTarget option:selected');
        const pingTarget = sanitizeInput(pingTargetSelected.val());
        const pingTargetText = sanitizeInput(pingTargetSelected.text());

        const pingChannelSelected = $('select#pingChannel option:selected');
        const webhookType = sanitizeInput(pingChannelSelected.data('webhook-type'));
        const webhookEmbedPing = sanitizeInput(pingChannelSelected.data('webhook-embed'));

        const fleetTypeSelected = $('select#fleetType option:selected');
        const fleetType = sanitizeInput(fleetTypeSelected.val());
        const webhookEmbedColor = sanitizeInput(fleetTypeSelected.data('embed-color'));

        const fcName = sanitizeInput($('input#fcName').val());
        const fleetName = sanitizeInput($('input#fleetName').val());
        const formupLocation = sanitizeInput($('input#formupLocation').val());
        const formupTime = sanitizeInput($('input#formupTime').val());
        const fleetComms = sanitizeInput($('input#fleetComms').val());
        const fleetDoctrine = sanitizeInput($('input#fleetDoctrine').val());
        const fleetSrp = sanitizeInput($('select#fleetSrp option:selected').val());
        const additionalInformation = sanitizeInput($('textarea#additionalInformation').val());

        const checkboxPrePing = $('input#prePing');
        const checkboxFormupTimeNow = $('input#formupTimeNow');
        const checkboxCreateOptimer = $('input#createOptimer');

        // Let's see if we can find a doctrine link
        let fleetDoctrineLink = null;
        if (fleetDoctrine !== '') {
            const selectedLink = $('#fleetDoctrineList [value="' + escapeInput(fleetDoctrine, false) + '"]').data('doctrine-url');

            if (undefined !== selectedLink && selectedLink !== '') {
                // Houston, we have a link!
                fleetDoctrineLink = selectedLink;
            }
        }

        // Ping webhooks, if configured
        let webhookUrl = false;

        if ($('select#pingChannel').length) {
            webhookUrl = sanitizeInput(pingChannelSelected.val());
        }

        $('.aa-fleetpings-no-ping').hide('fast');
        $('.aa-fleetpings-ping').show('fast');

        let webhookPingTextHeader = '';
        let webhookPingTextContent = '';
        let webhookPingTextFooter = '';
        let pingText = '';

        // Determine pingTarget and pingTargetText
        let discordPingTarget = '';
        let webhookPingTarget = '';

        if (pingTarget !== '') {
            // pingTarget
            if (pingTarget.indexOf('@') > -1) {
                webhookPingTarget = pingTarget;
            } else {
                webhookPingTarget = '<@&' + pingTarget + '>';
            }

            // pingTargetText
            if (pingTargetText.indexOf('@') > -1) {
                discordPingTarget = pingTargetText;
            } else {
                discordPingTarget = '@' + pingTargetText;
            }

            // Separator
            pingText += ' :: ';
        }

        // Fleet announcement
        pingText += '**';

        // Check if it's a pre-ping or not
        if (checkboxPrePing.is(':checked')) {
            pingText += '### PRE PING ###';
            webhookPingTextHeader += '### PRE PING ###';

            if (fleetType !== '') {
                pingText += ' / ' + fleetType + ' Fleet';
                webhookPingTextHeader += ' / ' + fleetType + ' Fleet';
            }
            // else {
            //     pingText += ' / Fleet';
            //     webhookPingTextHeader += ' / Fleet';
            // }
        } else {
            if (fleetType !== '') {
                pingText += fleetType + ' ';
                webhookPingTextHeader += fleetType + ' ';
            }

            pingText += 'Fleet is up';
            webhookPingTextHeader += 'Fleet is up';
        }

        pingText += '**' + '\n';

        // Check if FC name is available
        if (fcName !== '') {
            pingText += '\n' + '**FC:** ' + fcName;
            webhookPingTextContent += '\n' + '**FC:** ' + fcName;
        }

        // Check if fleet name is available
        if (fleetName !== '') {
            pingText += '\n' + '**Fleet Name:** ' + fleetName;
            webhookPingTextContent += '\n' + '**Fleet Name:** ' + fleetName;
        }

        // Check if form-up location is available
        if (formupLocation !== '') {
            pingText += '\n' + '**Formup Location:** ' + formupLocation;
            webhookPingTextContent += '\n' + '**Formup Location:** ' + formupLocation;
        }

        // Check if form-up time is available
        if (checkboxFormupTimeNow.is(':checked')) {
            pingText += '\n' + '**Formup Time:** NOW';
            webhookPingTextContent += '\n' + '**Formup Time:** NOW';
        } else {
            if (formupTime !== '') {
                pingText += '\n' + '**Formup Time:** ' + formupTime;
                webhookPingTextContent += '\n' + '**Formup Time:** ' + formupTime;

                // Get the timestamp and build the link to the timezones module if it's installed
                if (fleetpingsSettings.timezonesInstalled === true) {
                    var timezonesUrl = getTimezonesUrl(formupTime);

                    pingText += ' - ' + timezonesUrl;

                    if (webhookType === 'Discord') {
                        webhookPingTextContent += ' ([Time Zone Conversion](' + timezonesUrl + '))';
                    }

                    if (webhookType === 'Slack') {
                        webhookPingTextContent += ' (<' + timezonesUrl + '|Time Zone Conversion>)';
                    }
                }
            }
        }

        // Check if fleet comms is available
        if (fleetComms !== '') {
            pingText += '\n' + '**Comms:** ' + fleetComms;
            webhookPingTextContent += '\n' + '**Comms:** ' + fleetComms;
        }

        // Check if doctrine is available
        if (fleetDoctrine !== '') {
            pingText += '\n' + '**Ships / Doctrine:** ' + fleetDoctrine;
            webhookPingTextContent += '\n' + '**Ships / Doctrine:** ' + fleetDoctrine;

            // Grab the doctrine link if there is one
            if (fleetDoctrineLink !== null) {
                pingText += ' - ' + fleetDoctrineLink;

                if (webhookType === 'Discord') {
                    webhookPingTextContent += ' ([Doctrine Link](' + fleetDoctrineLink + '))';
                }

                if (webhookType === 'Slack') {
                    webhookPingTextContent += ' (<' + fleetDoctrineLink + '|Doctrine Link>)';
                }
            }
        }

        // Check if srp is available
        if (fleetSrp !== '') {
            pingText += '\n' + '**SRP:** ' + fleetSrp;
            webhookPingTextContent += '\n' + '**SRP:** ' + fleetSrp;

            if (fleetSrp === 'Yes' && fleetSrpCode !== '') {
                pingText += ' (SRP Code: ' + fleetSrpCode + ')';
                webhookPingTextContent += ' (SRP Code: ' + fleetSrpCode + ')';
            }
        }

        // Check if additional information is available
        if (additionalInformation !== '') {
            pingText += '\n\n' + '**Additional Information**:' + '\n' + additionalInformation;
            webhookPingTextContent += '\n\n' + '**Additional Information**:' + '\n' + additionalInformation;
        }

        if (fleetpingsSettings.platformUsed === 'Discord') {
            $('.aa-fleetpings-ping-text').html(
                '<p>' + nl2br(discordPingTarget + pingText) + '</p>'
            );
        }

        if (fleetpingsSettings.platformUsed === 'Slack') {
            $('.aa-fleetpings-ping-text').html(
                '<p>' + nl2br(discordPingTarget + pingText.split('**').join('*')) + '</p>'
            );
        }

        // Ping it directly if a webhook is selected
        if (webhookUrl !== false && webhookUrl !== '') {
            // add ping creator at the end
            if (fleetpingsSettings.pingCreator !== '') {
                pingText += '\n\n' + '*(Ping sent by: ' + fleetpingsSettings.pingCreator + ')*';
                webhookPingTextFooter = '(Ping sent by: ' + fleetpingsSettings.pingCreator + ')';
            }

            // Default embed color
            let embedColor = '#faa61a';

            if (fleetType !== '' && embedColor !== '') {
                embedColor = webhookEmbedColor;
            }

            // Add fcName if we have one
            if (fcName !== '') {
                webhookPingTextHeader += ' under ' + fcName;
            }

            // Send the ping to Discord
            if (webhookType === 'Discord') {
                if (undefined !== webhookEmbedPing && webhookEmbedPing === 'True') {
                    if (pingTarget !== '') {
                        webhookPingTarget += ' :: ';
                    }

                    sendEmbeddedDiscordPing(
                        webhookUrl,
                        webhookPingTarget + '**' + webhookPingTextHeader + '**' + '\n' + '** **',
                        // Embedded content » https://discohook.org/ - https://leovoel.github.io/embed-visualizer/
                        {
                            'title': '**.: Fleet Details :.**',
                            'description': webhookPingTextContent,
                            'color': hexToDecimal(embedColor),
                            'footer': {
                                'text': webhookPingTextFooter
                            }
                        }
                    );
                } else {
                    sendDiscordPing(webhookUrl, webhookPingTarget + pingText);
                }
            }

            // Send the ping to Discord
            if (webhookType === 'Slack') {
                let slackEmbedPingTarget = '';

                if (pingTarget !== '') {
                    slackEmbedPingTarget = '<' + webhookPingTarget.replace('@', '!') + '> :: ';
                }

                /**
                 * Payload to send to Slack
                 *
                 * @type {{attachments: [{color: string, footer: string, pretext: string, text: string, fallback: string}]}}
                 */
                var payload = {
                    'attachments': [
                        {
                            'fallback': pingText,
                            'color': embedColor,
                            'pretext': slackEmbedPingTarget + '*' + webhookPingTextHeader + '*',
                            'text': '*.: Fleet Details :.*' + '\n' + webhookPingTextContent.split('**').join('*'),
                            'footer': webhookPingTextFooter
//                            'footer_icon': 'https://platform.slack-edge.com/img/default_application_icon.png'
                        }
                    ]
                };

                sendSlackPing(webhookUrl, payload);
            }

            // Tell the FC that it's already pinged
            showSuccess(
                fleetpingsTranslations.ping.success,
                '.aa-fleetpings-ping-copyresult'
            );
        }

        // Create optimer if needed
        if (fleetpingsSettings.optimerInstalled === true) {
            if (checkboxPrePing.is(':checked') && checkboxCreateOptimer.is(':checked') && formupTime !== '') {
                const optimerAjaxUrl = fleetpingsSettings.optimerAjaxUrl;

                $.ajax({
                    url: optimerAjaxUrl,
                    type: 'post',
                    data: {
                        fleet_doctrine: fleetDoctrine,
                        formup_location: formupLocation,
                        formup_time: formupTime,
                        fleet_name: fleetName,
                        fleet_commander: fcName
                    },
                    headers: {
                        'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
                    }
                });

                // Re-set checkbox
                checkboxCreateOptimer.prop('checked', false);

                // Let the user know that an optimer has been created
                showSuccess(
                    fleetpingsTranslations.optimer.created,
                    '.fleetpings-create-optimer-message'
                );
            }
        }
    };

    /**
     * Copy the fleet ping to clipboard
     */
    const copyFleetPing = function () {
        /**
         * Copy text to clipboard
         *
         * @type Clipboard
         */
        const clipboardFleetPingData = new ClipboardJS('button#copyFleetPing');

        /**
         * Copy success
         *
         * @param {type} e
         */
        clipboardFleetPingData.on('success', function (e) {
            showSuccess(
                fleetpingsTranslations.copyToClipboard.success,
                '.aa-fleetpings-ping-copyresult'
            );

            e.clearSelection();
            clipboardFleetPingData.destroy();
        });

        /**
         * Copy error
         */
        clipboardFleetPingData.on('error', function () {
            showError(
                fleetpingsTranslations.copyToClipboard.error,
                '.aa-fleetpings-ping-copyresult'
            );

            clipboardFleetPingData.destroy();
        });
    };

    /* Events
    ----------------------------------------------------------------------------------------------------------------- */
    /**
     * Toggle "Create SRP Link" checkbox
     */
    if (fleetpingsSettings.srpModuleAvailableToUser === true) {
        if (sanitizeInput($('select#fleetSrp option:selected').val()) === 'Yes' && $('input#formupTimeNow').is(':checked')) {
            $('.fleetpings-create-srp-link').show('fast');
        } else {
            $('input#createSrpLink').prop('checked', false);
            $('.fleetpings-create-srp-link').hide('fast');
        }

        $('select#fleetSrp').change(function () {
            if (sanitizeInput($('select#fleetSrp option:selected').val()) === 'Yes' && $('input#formupTimeNow').is(':checked')) {
                $('.fleetpings-create-srp-link').show('fast');
            } else {
                $('input#createSrpLink').prop('checked', false);
                $('.fleetpings-create-srp-link').hide('fast');
            }
        });
    }

    /**
     * Toggle "Formup NOW" checkbox when "Pre-Ping" is toggled
     *
     * Behaviour:
     *  Pre-Ping checked
     *      » Formup NOW unchecked
     *      » Create Optimer is unchecked and hidden
     *      » Create SRP Link is displayed
     *  Pre-Ping unchecked
     *      » Formup NOW checked
     *      » Create Optimer is displayed
     *      » Create SRP Link is hidden and unchecked
     */
    $('#prePing').on('change', function () {
        if ($('input#prePing').is(':checked')) {
            $('input#formupTimeNow').prop('checked', false);
            $('input#formupTime').removeAttr('disabled');

            if (fleetpingsSettings.optimerInstalled === true) {
                $('.fleetpings-create-optimer').show('fast');
            }

            if (fleetpingsSettings.srpModuleAvailableToUser === true) {
                $('input#createSrpLink').prop('checked', false);
                $('.fleetpings-create-srp-link').hide('fast');
            }
        } else {
            $('input#formupTimeNow').prop('checked', true);
            $('input#formupTime').prop('disabled', true);

            if (fleetpingsSettings.optimerInstalled === true) {
                $('input#createOptimer').prop('checked', false);
                $('.fleetpings-create-optimer').hide('fast');
            }

            if (fleetpingsSettings.srpModuleAvailableToUser === true && sanitizeInput($('select#fleetSrp option:selected').val()) === 'Yes') {
                $('.fleetpings-create-srp-link').show('fast');
            }
        }
    });

    $('input#formupTimeNow').on('change', function () {
        if ($(this).is(':checked')) {
            $('input#prePing').prop('checked', false);
            $('input#formupTime').prop('disabled', true);

            if (fleetpingsSettings.optimerInstalled === true) {
                $('input#createOptimer').prop('checked', false);
                $('.fleetpings-create-optimer').hide('fast');
            }

            if (fleetpingsSettings.srpModuleAvailableToUser === true && sanitizeInput($('select#fleetSrp option:selected').val()) === 'Yes') {
                $('.fleetpings-create-srp-link').show('fast');
            }
        } else {
            $('input#prePing').prop('checked', true);
            $('input#formupTime').removeAttr('disabled');

            if (fleetpingsSettings.optimerInstalled === true) {
                $('.fleetpings-create-optimer').show('fast');
            }

            if (fleetpingsSettings.srpModuleAvailableToUser === true) {
                $('input#createSrpLink').prop('checked', false);
                $('.fleetpings-create-srp-link').hide('fast');
            }
        }
    });

    /**
     * Generate ping text
     */
    $('button#createPingText').on('click', function () {
        const fleetName = sanitizeInput($('input#fleetName').val());
        const fleetDoctrine = sanitizeInput($('input#fleetDoctrine').val());
        const checkboxCreateSrpLink = $('input#createSrpLink');
        const checkboxFormupTimeNow = $('input#formupTimeNow');

        if (checkboxCreateSrpLink.is(':checked') && checkboxFormupTimeNow.is(':checked')) {
            // Create SRP link
            const srpAjaxUrl = fleetpingsSettings.srpAjaxUrl;
            let srpCode = '';

            $.ajax({
                url: srpAjaxUrl,
                type: 'post',
                data: {
                    fleet_doctrine: fleetDoctrine,
                    fleet_name: fleetName
                },
                headers: {
                    'X-CSRFToken': sanitizeInput(
                        $('input[name="csrfmiddlewaretoken"]').val()
                    )
                }
            }).done(function (result) {
                srpCode = result.srp_code;

                generateFleetPing(srpCode);

                // Let the user know that an optimer has been created
                showSuccess(
                    fleetpingsTranslations.srp.created,
                    '.fleetpings-create-srp-link-message'
                );
            });

            // Re-set checkbox
            checkboxCreateSrpLink.prop('checked', false);
        } else {
            generateFleetPing('');
        }

        return false;
    });

    /**
     * Copy ping text
     */
    $('button#copyFleetPing').on('click', function () {
        copyFleetPing();
    });
});
