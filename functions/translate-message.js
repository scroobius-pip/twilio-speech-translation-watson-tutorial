const VoiceResponse = require('twilio').twiml.VoiceResponse

exports.handler = function (context, event, callback) {
    const twiml = new VoiceResponse();

    const speechResult = event.SpeechResult

    twiml.say("You said, " + speechResult)

    callback(null, twiml);
};
