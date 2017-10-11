'use strict';
const responses = require('./responses.js');
const https = require('https');

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

function searchLaptops(intentRequest, callback) {
    const brand = intentRequest.currentIntent.slots.brand.toLowerCase();
    const price = intentRequest.currentIntent.slots.priceUpperBound;

    let postBody = JSON.stringify({
        fetch: ["products"],
        filters: {
            "producttype": ["laptops"],
            "merk": [brand],
            price
        }
    });

    // make a request
    const options = {
        hostname: 'mobile-api.coolblue-production.eu',
        path: '/v5/search',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': 'nl-NL'
        }
    };

    const req = https.request(options, (res) => {
        let output = '';
        res.setEncoding('utf8');

        // Listener to receive data
        res.on('data', (chunk) => {
            output += chunk;
        });

        // Listener for initializing callback after receiving complete response
        res.on('end', () => {
            let response = JSON.parse(output);
            let reply = "I think I found what you need. What do you think of these laptops?\n";

            for (let i = 0; i < 3; i++) {
                reply += "http://coolblue-redirect.s3-website-us-east-1.amazonaws.com/productPage/?productId=" + response.products[i].productId + " \n";
            }

            return callback(responses.close(intentRequest.sessionAttributes, 'Fulfilled', {
                contentType: 'PlainText',
                content: reply
            }));
        });
    });
    req.write(postBody);
    req.end();
}

function validatePrice(intentRequest) {
    if (Number.parseInt(intentRequest.currentIntent.slots.priceUpperBound) < 200) {
        return responses.buildValidationResult(
            false,
            'priceUpperBound',
            'Unfortunately we don\'t have laptops THAT cheap. The cheapest laptops we have are around €250, but a' +
            ' low-end laptop that will last you a couple of years is at least €500. If you want to use your laptop' +
            ' intensively, be prepared to spend at least €700. Based on this... how much are you willing to spend?'
        );
    }

    return responses.buildValidationResult(true, null, null);
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

    if (slots.intention === 'Gaming' && !slots.gamerType) {
        return callback(branchGamingIntention(sessionAttributes, intentRequest.currentIntent.name, slots));
    }

    if (slots.priceUpperBound && !slots.brand) {
        let validationResult = validatePrice(intentRequest, callback);
        if (!validationResult.isValid) {
            slots[`${validationResult.violatedSlot}`] = null;
            callback(responses.elicitSlot(
                intentRequest.sessionAttributes,
                intentRequest.currentIntent.name,
                slots,
                validationResult.violatedSlot,
                validationResult.message)
            );
            return;
        }

        callback(responses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
        return;
    }

    if (slots.intention && slots.priceUpperBound && slots.brand) {
        return searchLaptops(intentRequest, callback);
    }

    return callback(responses.delegate(sessionAttributes, slots));
}

exports.handleDialogFlow = handleDialogFlow;
