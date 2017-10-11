shutUp = require('shutUp.js');
laptop = require('laptop.js');
humor = require('humor.js');
username = require('storeUsername.js');

/**
 * Called when the user specifies an intent for this skill.
 */
function dispatch(intentRequest, callback) {
    // console.log(JSON.stringify(intentRequest, null, 2));
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

    if (shutUp.conversationHasEnded(intentRequest)) {
        return callback(responses.close(intentRequest.sessionAttributes, 'Fulfilled', 'This conversation is over.'));
    }

    const intentName = intentRequest.currentIntent.name;
    // Dispatch to your skill's intent handlers
    if (intentName === 'LaptopProductAdvice') {
        return laptop.handleDialogFlow(intentRequest, callback);
    } else if (intentName === 'AskCustomerName') {
        return username.askCustomersName(intentRequest, callback);
    } else if (intentName === 'Joke') {
        return humor.handleJoke(intentRequest, callback);
    } else if (intentName === 'Compliment') {
        return humor.handleCompliment(intentRequest, callback);
    }

    throw new Error(`Intent with name ${intentName} not supported`);
}

exports.handler = (event, context, callback) => {
    try {
        // By default, treat the user request as coming from the America/New_York time zone.
        process.env.TZ = 'Europe/Amsterdam';
        console.log(`event.bot.name=${event.bot.name}`);

        /**
         * Uncomment this if statement and populate with your Lex bot name and / or version as
         * a sanity check to prevent invoking this Lambda function from an undesired Lex bot or
         * bot version.
         */
        if (event.bot.name !== 'Joey') {
             callback('Bot Name invalid. Not handling this request...');
        }

        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }
};
