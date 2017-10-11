shutUp = require('shutUp.js');
laptop = require('laptop.js');
joke = require('joke.js');

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
    } else if (intentName === 'joke') {
        return joke.handleDialogFlow(intentRequest, callback);
    }

    throw new Error(`Intent with name ${intentName} not supported`);
}
