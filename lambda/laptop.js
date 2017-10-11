'use strict';
const responses = require('./responses.js');

/**
 * This sample demonstrates an implementation of the Lex Code Hook Interface
 * in order to serve a sample bot which manages reservations for hotel rooms and car rentals.
 * Bot, Intent, and Slot models which are compatible with this sample can be found in the Lex Console
 * as part of the 'BookTrip' template.
 *
 * For instructions on how to set up and test this bot, as well as additional samples,
 *  visit the Lex Getting Started documentation.
 */
function branchGamingIntention(sessionAttributes, intentName, slots) {

    if (slots.gamerType === undefined || slots.gamerType === null) {
        return responses.elicitSlot(sessionAttributes, intentName, slots, 'gamerType', {
                contentType: 'PlainText',
                content: 'Cool, you enjoy gaming! Would you say' +
                ' you\'re more of a Candycrush / Angry Birds player, or do you prefer more intense games like' +
                ' Overwatch / The Witcher?'
            }
        );
    }

    return responses.delegate(sessionAttributes, slots);
}

/**
 * Performs dialog management and fulfillment for booking a hotel.
 *
 * Beyond fulfillment, the implementation for this intent demonstrates the following:
 *   1) Use of elicitSlot in slot validation and re-prompting
 *   2) Use of sessionAttributes to pass information that can be used to guide conversation
 */
function handleDialogFlow(intentRequest, callback) {
    const sessionAttributes = intentRequest.sessionAttributes || {};
    const slots = intentRequest.currentIntent.slots;

    if (slots.intention === 'Gaming') {
        return callback(branchGamingIntention(sessionAttributes, intentRequest.currentIntent.name, slots));
    }

    return callback(responses.delegate(sessionAttributes, slots));
}

exports.handleDialogFlow = handleDialogFlow;
