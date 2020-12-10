const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');




export async function getLanguageCode(language, apikey) {
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
        return {}
    }
}
