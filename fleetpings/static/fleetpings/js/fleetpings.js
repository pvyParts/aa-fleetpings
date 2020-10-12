/* global fleetpingsSettings, fleetpingsTranslations */

jQuery(document).ready(function($) {
    /* Functions
    ----------------------------------------------------------------------------------------------------------------- */

    /**
     * convert line breaks into <br>
     *
     * @param {string} string
     * @param {bool} isXhtml
     */
    var nl2br = function(string, isXhtml) {
        var breakTag = isXhtml || typeof isXhtml === 'undefined' ? '<br />' : '<br>';

        return (string + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    };

    /**
     * closing the message
     *
     * @param {string} element
     * @returns {void}
     */
    var closeCopyMessageElement = function(element) {
        /**
         * close after 10 seconds
         */
        $(element).fadeTo(10000, 500).slideUp(500, function() {
            $(this).slideUp(500, function() {
                $(this).remove();
            });
        });
    };

    /**
     * show message when copy action was successful
     *
     * @param {string} message
     * @param {string} element
     * @returns {undefined}
     */
    var showSuccess = function(message, element) {
        $(element).html('<div class="alert alert-success alert-dismissable alert-copy-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message + '</div>');

        closeCopyMessageElement('.alert-copy-success');

        return;
    };

    /**
     * show message when copy action was not successful
     *
     * @param {string} message
     * @param {string} element
     * @returns {undefined}
     */
    var showError = function(message, element) {
        $(element).html('<div class="alert alert-danger alert-dismissable alert-copy-error"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message + '</div>');

        closeCopyMessageElement('.alert-copy-error');

        return;
    };

    /**
     * sanitize input string
     *
     * @param {string} element
     * @returns {undefined}
     */
    var sanitizeInput = function(input) {
        if(input) {
            return input.replace(/<(|\/|[^>\/bi]|\/[^>bi]|[^\/>][^>]+|\/[^>][^>]+)>/g, '');
        } else {
            return input;
        }
    };

    /**
     * send an embedded message to a Discord webhook
     *
     * @param {string} webhookUrl
     * @param {string} content
     * @param {object} embeds
     */
    var sendEmbeddedDiscordPing = function(webhookUrl, content, embeds) {
        var request = new XMLHttpRequest();

        request.open('POST', webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');

        var params = {
            username: '',
            avatar_url: '',
            content: content,
            embeds: [embeds]
        };

        request.send(JSON.stringify(params));
    };

    /**
     * send a message to a Discord webhook
     *
     * @param {string} webhookUrl
     * @param {string} pingText
     */
    var sendDiscordPing = function(webhookUrl, pingText) {
        var request = new XMLHttpRequest();

        request.open('POST', webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');

        var params = {
            username: '',
            avatar_url: '',
            content: pingText
        };

        request.send(JSON.stringify(params));
    };

    /**
     * send a message to a Slack webhook
     *
     * @param {string} webhookUrl
     * @param {object} payload
     */
    var sendSlackPing = function(webhookUrl, payload) {
        $.ajax({
            data: 'payload=' + JSON.stringify(payload),
            dataType: 'json',
            processData: false,
            type: 'POST',
            url: webhookUrl
        });
    };

    /**
     * convert hex color code in something Discord can handle
     *
     * @param {string} hexValue
     */
    var hexToDecimal = function(hexValue) {
        return parseInt(hexValue.replace('#',''), 16);
    };

    /**
     * convert the datepicker info into an URL that the
     * aa-tomezones module understands
     *
     * @param {string} formupTime
     */
    var getTimezonesUrl = function(formupTime) {
        var formupDateTime = new Date(formupTime)
        var formupTimestamp = (formupDateTime.getTime() - formupDateTime.getTimezoneOffset() *60 * 1000) / 1000;
        var timezonesUrl = '';

        if(fleetpingsSettings.useNewTimezoneLinks === true) {
            timezonesUrl = fleetpingsSettings.siteUrl + 'timezones/' + formupTimestamp + '/';
        } else {
            timezonesUrl = fleetpingsSettings.siteUrl + 'timezones/?#' + formupTimestamp;
        }

        return timezonesUrl;
    };

    /**
     * create the ping text
     */
    var generateFleetPing = function() {
        var pingTarget = sanitizeInput($('select#pingTarget option:selected').val());
        var pingTargetText = sanitizeInput($('select#pingTarget option:selected').text());

        var webhookType = sanitizeInput($('select#pingChannel option:selected').data('webhook-type'));
        var webhookEmbedPing = sanitizeInput($('select#pingChannel option:selected').data('webhook-embed'));

        var fleetType = sanitizeInput($('select#fleetType option:selected').val());
        var webhookEmbedColor = sanitizeInput($('select#fleetType option:selected').data('embed-color'));

        var fcName = sanitizeInput($('input#fcName').val());
        var fleetName = sanitizeInput($('input#fleetName').val());
        var formupLocation = sanitizeInput($('input#formupLocation').val());
        var formupTime = sanitizeInput($('input#formupTime').val());
        var fleetComms = sanitizeInput($('input#fleetComms').val());
        var fleetDoctrine = sanitizeInput($('input#fleetDoctrine').val());
        var fleetSrp = sanitizeInput($('select#fleetSrp option:selected').val());
        var additionalInformation = sanitizeInput($('textarea#additionalInformation').val());

        // let's see if we can find a doctrine link
        var fleetDoctrineLink = null;
        if(fleetDoctrine !== '') {
            selectedLink = $('#fleetDoctrineList [value="' + fleetDoctrine + '"]').data('doctrine-url');

            if(undefined !== selectedLink && selectedLink !== '') {
                // Houston, we have a link!
                fleetDoctrineLink = selectedLink;
            }
        }

        // ping webhooks, if configured
        var webhookUrl = false;

        if($('select#pingChannel').length) {
            webhookUrl = sanitizeInput($('select#pingChannel option:selected').val());
        }

        $('.aa-fleetpings-ping').show();

        var webhookPingTextHeader = '';
        var webhookPingTextContent = '';
        var webhookPingTextFooter = '';
        var pingText = '';

        // determine pingTargetText
        if(pingTargetText.indexOf('@') > -1) {
            discordPingTarget = pingTargetText;
        } else {
            discordPingTarget = '@' + pingTargetText;
        }

        // determine pingTarget
        if(pingTarget.indexOf('@') > -1) {
            webhookPingTarget = pingTarget;
        } else {
            webhookPingTarget = '<@&' + pingTarget + '>';
        }

        // separator
        pingText += ' :: ';

        // fleet announcement
        pingText += '**';

        // check if it's a pre-ping or not
        if($('input#prePing').is(':checked')) {
            pingText += '### PRE PING ###';
            webhookPingTextHeader += '### PRE PING ###';

            if(fleetType !== '') {
                pingText += ' / ' + fleetType + ' Fleet';
                webhookPingTextHeader += ' / ' + fleetType + ' Fleet';
            } else {
                pingText += ' / Fleet';
                webhookPingTextHeader += ' / Fleet';
            }
        } else {
            if(fleetType !== '') {
                pingText += fleetType + ' ';
                webhookPingTextHeader += fleetType + ' ';
            }

            pingText += 'Fleet is up';
            webhookPingTextHeader += 'Fleet is up';
        }

        pingText += '**' + "\n";

        // check if FC name is available
        if(fcName !== '') {
            pingText += "\n" + '**FC:** ' + fcName;
            webhookPingTextContent += "\n" + '**FC:** ' + fcName;
        }

        // check if fleet name is available
        if(fleetName !== '') {
            pingText += "\n" + '**Fleet Name:** ' + fleetName;
            webhookPingTextContent += "\n" + '**Fleet Name:** ' + fleetName;
        }

        // check if form-up location is available
        if(formupLocation !== '') {
            pingText += "\n" + '**Formup Location:** ' + formupLocation;
            webhookPingTextContent += "\n" + '**Formup Location:** ' + formupLocation;
        }

        // check if form-up time is available
        if($('input#formupTimeNow').is(':checked')) {
            pingText += "\n" + '**Formup Time:** NOW';
            webhookPingTextContent += "\n" + '**Formup Time:** NOW';
        } else {
            if(formupTime !== '') {
                pingText += "\n" + '**Formup Time:** ' + formupTime;
                webhookPingTextContent += "\n" + '**Formup Time:** ' + formupTime;

                // get the timestamp and build the link to the timezones module if it's installed
                if(fleetpingsSettings.timezonesInstalled === true) {
                    var timezonesUrl = getTimezonesUrl(formupTime);

                    pingText += ' - ' + timezonesUrl;

                    if(webhookType === 'Discord') {
                        webhookPingTextContent += ' ([Time Zone Conversion](' + timezonesUrl + '))';
                    }

                    if(webhookType === 'Slack') {
                        webhookPingTextContent += ' (<' + timezonesUrl + '|Time Zone Conversion>)';
                    }
                }
            }
        }

        // check if fleet comms is available
        if(fleetComms !== '') {
            pingText += "\n" + '**Comms:** ' + fleetComms;
            webhookPingTextContent += "\n" + '**Comms:** ' + fleetComms;
        }

        // check if doctrine is available
        if(fleetDoctrine !== '') {
            pingText += "\n" + '**Ships / Doctrine:** ' + fleetDoctrine;
            webhookPingTextContent += "\n" + '**Ships / Doctrine:** ' + fleetDoctrine;

            // grab the doctrine link if there is one
            if(fleetDoctrineLink !== null) {
                pingText += ' - ' + fleetDoctrineLink;

                if(webhookType === 'Discord') {
                        webhookPingTextContent += ' ([Doctrine Link](' + fleetDoctrineLink + '))';
                    }

                    if(webhookType === 'Slack') {
                        webhookPingTextContent += ' (<' + fleetDoctrineLink + '|Doctrine Link>)';
                    }
            }
        }

        // check if srp is available
        if(fleetSrp !== '') {
            pingText += "\n" + '**SRP:** ' + fleetSrp;
            webhookPingTextContent += "\n" + '**SRP:** ' + fleetSrp;
        }

        // check if additional information is available
        if(additionalInformation !== '') {
            pingText += "\n\n" + '**Additional Information**:' + "\n" + additionalInformation;
            webhookPingTextContent += "\n\n" + '**Additional Information**:' + "\n" + additionalInformation;
        }

        if(fleetpingsSettings.platformUsed === 'Discord') {
            $('.aa-fleetpings-ping-text').html('<p>' + nl2br(discordPingTarget + pingText) + '</p>');
        }

        if(fleetpingsSettings.platformUsed === 'Slack') {
            $('.aa-fleetpings-ping-text').html('<p>' + nl2br(discordPingTarget + pingText.split('**').join('*')) + '</p>');
        }

        // ping it directly if a webhook is selected
        if(webhookUrl !== false && webhookUrl !== '') {
            // add ping creator at the end
            if(fleetpingsSettings.pingCreator !== '') {
                pingText += "\n\n" + '*(Ping sent by: ' + fleetpingsSettings.pingCreator + ')*';
                webhookPingTextFooter = '(Ping sent by: ' + fleetpingsSettings.pingCreator + ')';
            }

            // default embed color
            var embedColor = '#faa61a';

            if(fleetType !== '' && embedColor !== '') {
                embedColor = webhookEmbedColor;
            }

            // add fcName if we have one
            if(fcName !== '') {
                webhookPingTextHeader += ' under ' + fcName;
            }

            var copyPasteText = '';

            // send the ping to Discord
            if(webhookType === 'Discord') {
                if(undefined !== webhookEmbedPing && webhookEmbedPing === 'True') {
                    sendEmbeddedDiscordPing(
                        webhookUrl,
                        webhookPingTarget + ' :: **' + webhookPingTextHeader + '**' + "\n" + '** **',
                        // embedded content » https://discohook.org/ - https://leovoel.github.io/embed-visualizer/
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

            // send the ping to Discord
            if(webhookType === 'Slack') {
                var slackEmbedPingTarget = webhookPingTarget.replace('@', '!');

                /**
                 * payload to send to Slack
                 *
                 * @type {{attachments: [{color: string, footer: string, pretext: string, text: string, fallback: string}]}}
                 */
                var payload = {
                    'attachments': [
                        {
                            'fallback': pingText,
                            'color': embedColor,
                            'pretext': '<' + slackEmbedPingTarget + '>' + ' :: *' + webhookPingTextHeader + '*',
                            'text': '*.: Fleet Details :.*' + "\n" + webhookPingTextContent.split('**').join('*'),
                            'footer': webhookPingTextFooter,
//                            'footer_icon': 'https://platform.slack-edge.com/img/default_application_icon.png'
                        }
                    ]
                };

                sendSlackPing(webhookUrl, payload);
            }

            // tell the FC that it's already pinged
            showSuccess(
                fleetpingsTranslations.ping.success,
                '.aa-fleetpings-ping-copyresult'
            );
        }
    };

    /**
     * copy the fleet ping to clipboard
     */
    var CopyFleetPing = function() {
        /**
         * copy text to clipboard
         *
         * @type Clipboard
         */
        var clipboardFleetPingData = new ClipboardJS('button#copyFleetPing');

        /**
         * copy success
         *
         * @param {type} e
         */
        clipboardFleetPingData.on('success', function(e) {
            showSuccess(
                fleetpingsTranslations.copyToClipboard.success,
                '.aa-fleetpings-ping-copyresult'
            );

            e.clearSelection();
            clipboardFleetPingData.destroy();
        });

        /**
         * copy error
         */
        clipboardFleetPingData.on('error', function() {
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
     * toggle "Formup NOW" checkbox when "Pre-Ping" is toggled
     *
     * Behaviour:
     *  Pre-Ping checked » Formup NOW unchecked and disabled
     *  Pre-Ping unchecked » Formup NOW checked and enabled
     */
    $('#prePing').on('change', function() {
        if($('input#prePing').is(':checked')) {
            $('#formupTimeNow').removeAttr('checked');
            $('#formupTimeNow').prop('disabled', true);
            $('#formupTime').removeAttr('disabled');
        } else {
            $('#formupTimeNow').prop('checked', true);
            $('#formupTimeNow').removeAttr('disabled');
            $('#formupTime').prop('disabled', true);
        }
    });

    $('#formupTimeNow').on('change', function() {
        if($('input#formupTimeNow').is(':checked')) {
            $('#formupTime').prop('disabled', true);
        } else {
            $('#formupTime').removeAttr('disabled');
            $('#prePing').prop('checked', true);
        }
    });

    /**
     * generate ping text
     */
    $('button#createPingText').on('click', function() {
        generateFleetPing();
    });

    /**
     * copy ping text
     */
    $('button#copyFleetPing').on('click', function() {
        CopyFleetPing();
    });
});
