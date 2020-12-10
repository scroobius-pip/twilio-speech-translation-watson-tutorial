const VoiceResponse = require('twilio').twiml.VoiceResponse
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

exports.handler = async function (context, event, callback) {
    const twiml = new VoiceResponse();

    const speechResult = event.SpeechResult
    const languageCode = event.languageCode //obtained from the request parameter /translate-message?code=
    const voiceCode = event.voiceCode

    const translatedSpeech = await translateSpeechResult(speechResult, languageCode, context.WATSON_KEY)
    if (!translatedSpeech) {

        twiml.say("Could not translate")
        console.log(translatedSpeech)
        callback(null, twiml)
    }
    twiml.say(`${speechResult} means`)
    twiml.say({ language: voiceCode }, `${translatedSpeech}`)


    callback(null, twiml);
};

async function translateSpeechResult(speechResult, targetLanguageCode, apikey) {
    try {

        const languageTranslator = new LanguageTranslatorV3({
            version: '2018-05-01',
            authenticator: new IamAuthenticator({
                apikey,
            }),
            serviceUrl: 'https://api.eu-gb.language-translator.watson.cloud.ibm.com',
        });

        const result = (await languageTranslator.translate({
            text: speechResult,
            target: targetLanguageCode
        })).result
        return result.translations[0].translation
    } catch (err) {
        console.log(err)
        return ''
    }
} 