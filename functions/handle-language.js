const { Twilio } = require('twilio');
const { getLanguageCode } = require('../assets/watson.private');

const VoiceResponse = require('twilio').twiml.VoiceResponse


exports.handler = async function (context, event, callback) {

    const twiml = new VoiceResponse();
    const speechResult = event.SpeechResult

    if (!speechResult) {
        twiml.say("You didn't say anything.")
    } else {
        try {
            const language = speechResult.toLowerCase()
            const languageCode = await getLanguageCode(language, context.WATSON_KEY)
            if (languageCode) {

                twiml.gather({
                    input: ['speech'],
                    action: '/translate-message'
                })
                    .say(`Great! Your words will be translated to ${language}, What message do you want to translate ?`)

            } else {
                twiml.say("Language not supported")

            }
        } catch (error) {
            console.log(error)
            twiml.say("There was an issue getting supported languages")
        }
    }

    callback(null, twiml);
};


