exports.elicitSlot = (sessionAttributes, intentName, slots, slotToElicit, message) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,
        },
    };
};

exports.confirmIntent = (sessionAttributes, intentName, slots, message) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ConfirmIntent',
            intentName,
            slots,
            message,
        },
    };
};

exports.close = (sessionAttributes, fulfillmentState, message) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
};

exports.delegate = (sessionAttributes, slots) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots,
        },
    };
};

exports.buildValidationResult = (isValid, violatedSlot, messageContent) => {
    if (messageContent === null) {
        return {
            isValid,
            violatedSlot,
        };
    }
    return {
        isValid,
        violatedSlot,
        message: { contentType: 'PlainText', content: messageContent },
    };
};
