const { Twilio } = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse

const languageOptions = {
    "1": {
        language: "german",
        voiceCode: "de-DE"
    },
    "2": {
        language: "french",
        voiceCode: "fr-FR"
    },
    "3": {
        language: "japanese",
        voiceCode: "ja-JP"
    }
}

exports.handler = async function (context, event, callback) {

    const twiml = new VoiceResponse();
    const digit = event.Digits


    if (!languageOptions[digit]) {
        twiml.say("You didn't say anything.")
    } else {
        const { language, voiceCode } = languageOptions[digit]
        twiml.say(`Great! Your words will be translated to ${language}`)
    }

    callback(null, twiml);
};

