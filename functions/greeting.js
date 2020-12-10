const VoiceResponse = require('twilio').twiml.VoiceResponse

const voiceConfig = {
    voice: "Polly.Amy-Neural"
}

const supportedLanguages = ['german', 'french', 'japanese']

exports.handler = function (context, event, callback) {
    const twiml = new VoiceResponse();

    const gather = twiml
        .gather({
            finishOnKey: '',
            action: '/handle-language'
        })

    gather.say(voiceConfig, "What language do you want to translate to ?")

    supportedLanguages.forEach((language, index) => {
        gather.say(voiceConfig, `Select ${index + 1} to translate to ${language}`)
    })

    callback(null, twiml);
};
