responses = require('responses.js');

exports.endConversation = (intentRequest, callback) => {
    intentRequest.sessionAttributes['shutUp'] = 1;
    callback(responses.close(intentRequest.sessionAttributes, 'Fulfilled', 'Goodbye.'));
};

exports.conversationHasEnded = (intentRequest) => {
    return (intentRequest.sessionAttributes['shutUp'] === 1);
};
