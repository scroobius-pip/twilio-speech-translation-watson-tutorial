const VoiceResponse = require('twilio').twiml.VoiceResponse

exports.handler = function (context, event, callback) {
    const twiml = new VoiceResponse();

    twiml
        .gather({
            input: ['speech'],
            action: '/handle-language'
        })
        .say("What language do you want to translate to ?")

    callback(null, twiml);
};
