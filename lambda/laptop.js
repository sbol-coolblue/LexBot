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
   let postBody = JSON.stringify({
      fetch: ["products"],
      query: "laptops",
      filters: {}
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

        // Listener for intializing callback after receiving complete response
        res.on('end', () => {
            let response = JSON.parse(output);
            let reply = "I think I found what you need. What do you think of these laptops?\n"

            for(let i = 0; i < 3; i++) {
                reply += "http://coolblue-redirect.s3-website-us-east-1.amazonaws.com/productPage/?productId=" + response.products[i].productId + " \n";
            }

            callback(close(intentRequest.sessionAttributes, 'Fulfilled', {
                contentType: 'PlainText',
                content: reply
            }));
        });
      });
   req.write(postBody);
   req.end();
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
