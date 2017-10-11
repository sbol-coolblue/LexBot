username = require('storeUsername.js');
responses = require('responses.js');
laptop = require('laptop.js');

/**
 * Called when the user specifies an intent for this skill.
 */
exports.handler = (event, context, callback) => {
    try {
        // By default, treat the user request as coming from the America/New_York time zone.
        process.env.TZ = 'Europe/Amsterdam';
        console.log(`event.bot.name=${event.bot.name}`);
        console.log(`event.inputTranscript=${event.inputTranscript}`);

        /**
         * Uncomment this if statement and populate with your Lex bot name and / or version as
         * a sanity check to prevent invoking this Lambda function from an undesired Lex bot or
         * bot version.
         */
        // if (event.bot.name !== 'Joey') {
        //      callback('Bot Name invalid. Not handling this request...');
        // }

        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }
};

function dispatch(intentRequest, callback) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    console.log(JSON.stringify(intentRequest));

    const intentName = intentRequest.currentIntent.name;
    // Dispatch to your skill's intent handlers
    if (intentName === 'AskCustomersName') {
        return username.askCustomersName(intentRequest, callback);
    } else if (intentName === 'LaptopProductAdvice') {
        return laptop.handleDialogFlow(intentRequest, callback);
    }

    throw new Error(`Intent with name ${intentName} not supported`);
}
