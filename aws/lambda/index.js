// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const { default: axios } = require('axios');

const messages = {
    NOTIFY_MISSING_PERMISSIONS: 'Por favor, ative as permissões de usuário no Aplicativo Alexa.',
    ERROR: 'Ops. Algo Deu errado. Não conseguimos recuperar seu email!'
};

const APP_NAME = "Bater Ponto";
const EMAIL_PERMISSION = "alexa::profile:email:read";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {

        const { serviceClientFactory, responseBuilder } = handlerInput;

        const getEmail = async () => {
            try {

                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const profileEmail = await upsServiceClient.getProfileEmail();


                if (!profileEmail) {
                    return {
                        status: false,
                        code: 404
                    }
                }

                return {
                    status: true,
                    code: 200,
                    email: profileEmail
                }
            } catch (error) {
                if (error.statusCode == 403) {
                    return {
                        status: false,
                        code: 403
                    }
                }
                return {
                    status: false,
                    code: 500
                }
            }
        }

        const profileData = await getEmail();

        if (!profileData.status) {
            if (profileData.code === 403) {
                return responseBuilder
                    .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                    .withAskForPermissionsConsentCard([EMAIL_PERMISSION])
                    .getResponse();
            }
            if (profileData.code === 404) {
                const noEmailResponse = 'Não existe um email viculado a sua Alexa. Configure o para poder usar esse recurso.'
                return responseBuilder
                    .speak(noEmailResponse)
                    .withSimpleCard(APP_NAME, noEmailResponse)
                    .getResponse();
            }
            return responseBuilder.speak(messages.ERROR).getResponse();
        }

        try {
            const saveRegister = async () => {
                await axios.post("https://alexa-pontomais.herokuapp.com/alexa", {...handlerInput, profileData })
            }
            saveRegister();
        } catch (e) {
            return responseBuilder.speak(messages.ERROR).getResponse();
        }

        const speakOutput = 'Ponto Registrado';
        return responseBuilder
            .speak(speakOutput)
            .withSimpleCard(APP_NAME, speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .withApiClient(new Alexa.DefaultApiClient())
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
