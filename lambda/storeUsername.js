'use strict';
const responses = require('responses.js');

// ---------------- Helper Functions --------------------------------------------------
function buildValidationResult(isValid, violatedSlot, messageContent) {
    if (messageContent === null) {
        return {isValid, violatedSlot,};
    }
    return {
        isValid,
        violatedSlot,
        message: {contentType: 'PlainText', content: messageContent},
    };
}

function validateName(name) {
    const badWords = ['Roelof', 'Sander', 'Joey'];

    if (badWords.indexOf(name) !== -1) {
        return buildValidationResult(false, 'name', 'I do not believe that is your real name...');
    }

    return buildValidationResult(true, null, null);
}

// --------------- Functions that control the bot's behavior -----------------------

/**
 * Performs dialog management and fulfillment for asking the user's name.
 *
 * Beyond fulfillment, the implementation of this intent demonstrates the use of the elicitSlot dialog action
 * in slot validation and re-prompting.
 */
exports.askCustomersName = (intentRequest, callback) => {
    const name = intentRequest.currentIntent.slots.name;
    const source = intentRequest.invocationSource;

    if (source === 'DialogCodeHook') {
        // Perform basic validation on the supplied input slots.  Use the elicitSlot dialog action to re-prompt for the first violation detected.
        const slots = intentRequest.currentIntent.slots;
        const validationResult = validateName(name);
        if (!validationResult.isValid) {
            slots[`${validationResult.violatedSlot}`] = null;
            callback(responses.elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));
            return;
        }

        // Store the username in the Session Attributes, for consumption by different Intents.
        const outputSessionAttributes = intentRequest.sessionAttributes || {};
        if (name) {
            outputSessionAttributes.UserName = name;
        }
        callback(responses.delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
        return;
    }

    callback(
        responses.close(
            intentRequest.sessionAttributes,
            'Fulfilled',
            {
                contentType: 'PlainText',
                content: `Alrighty! A pleasure to meet you, ${name}! My name is Chad, and I'm into techno and long walks on the beach. And helping you find the best matching product! What type of product are you looking for?`
            }
        )
    );
};
