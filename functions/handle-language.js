const { Twilio } = require('twilio');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');



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
        try {
            const { language, voiceCode } = languageOptions[digit]


            const languageCode = await getLanguageCode(language, context.WATSON_KEY)
            if (languageCode) {

                twiml.gather({
                    input: ['speech'],

                    action: `/translate-message?languageCode=${languageCode}&voiceCode=${voiceCode}`
                })
                    .say(`Great! Your words will be translated to ${language}, What message do you want to translate ?`)

            } else {
                twiml.say("Sorry, language not supported")
                twiml.redirect('/greeting')

            }
        } catch (error) {
            console.log(error)
            twiml.say("There was an issue getting supported languages")
        }
    }

    callback(null, twiml);
};



async function getLanguageCode(language, apikey) {
    const supportedLanguages = await getSupportedLanguages(apikey)

    return supportedLanguages[language]
}

async function getSupportedLanguages(apikey) {
    try {

        const languageTranslator = new LanguageTranslatorV3({
            version: '2018-05-01',
            authenticator: new IamAuthenticator({
                apikey,
            }),
            serviceUrl: 'https://api.eu-gb.language-translator.watson.cloud.ibm.com',
        });

        const languages = (await languageTranslator.listLanguages()).result.languages

        const languageObj = languages.reduce((previousObj, currentLanguage) => {
            return {
                ...previousObj,
                [currentLanguage.language_name.toLowerCase()]: currentLanguage.language
            }
        }, {})

        return languageObj

    } catch (error) {
        console.log(error)
        throw 'Issue getting languages'
    }
}