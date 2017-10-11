const responses = require('responses.js');

jokes = [
    'How do you call my car? Botsauto!'
];

compliments = [
    'I like you, human! You\'ll be my favorite human pet when the robot apocalypse happens!'
];

exports.handleJoke = (intentRequest, callback) => {
    jokes = jokes[Math.floor(Math.random() * jokes.length)];
    return callback(responses.close(intentRequest.sessionAttributes, 'Fulfilled', jokes))
};

exports.handleCompliment = (intentRequest, callback) => {
    compliment = compliments[Math.floor(Math.random() * compliments.length)];
    return callback(responses.close(intentRequest.sessionAttributes, 'Fulfilled', compliment))
};
