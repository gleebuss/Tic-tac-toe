import {
    createUserScenario,
    createSystemScenario,
    createSaluteRequest,
    createSaluteResponse,
    createScenarioWalker,
    createMatchers,
    SaluteRequest,
    NLPRequest,
    NLPResponse,
    createIntents,
} from '@salutejs/scenario';
import { SaluteMemoryStorage } from '@salutejs/storage-adapter-memory';
import { SmartAppBrainRecognizer } from '@salutejs/recognizer-smartapp-brain';
import { runAppHandler, closeAppHander, noMatchHandler, winner, chooseSide, move, restart, side, button_chooseSide, parseScreen} from './handlers'
import model from '../intents.json';

const {regexp, action} = createMatchers<SaluteRequest>();

const userScenario = createUserScenario({
    chooseSide: {
        match: regexp(/^(?:Я буду играть за )?(?<side>крестики|нолики)$/i, { normalized: false }),
        handle: chooseSide,
    },
    move: {
        match: regexp(/^(?:Я пойду на )?(?<index>([01]?[0-9]|2[0-4]))$/i),
        handle: move,
    },
    restart: {
        match: regexp(/^Заново$/i),
        handle: restart,
    },
    help: {
        match: regexp(/^Помощь$/i),
        handle: noMatchHandler,
    },
    winner:{
        match: action('winner'),
        handle: winner
    },
    side:{
        match: action('side'),
        handle: side
    },
    button_restart:{
        match: action('button_restart'),
        handle: restart
    },
    button_chooseSide:{
        match: action('button_chooseSide'),
        handle: button_chooseSide,
    },
    parseScreen:{
        match: action('parseScreen'),
        handle: parseScreen
    },
    
});

const scenarioWalker = createScenarioWalker({
    intents: createIntents(model.intents),
    systemScenario: createSystemScenario({
        RUN_APP: runAppHandler,
        NO_MATCH: noMatchHandler,
        CLOSE_APP: closeAppHander
    }),
    recognizer: new SmartAppBrainRecognizer("7f6e8d51-dc13-4d72-a68b-e3edd27bbe6a"),
    userScenario,
});


const storage = new SaluteMemoryStorage();

export const handleNlpRequest = async (request: NLPRequest): Promise<NLPResponse> => {
    const req = createSaluteRequest(request);
    const res = createSaluteResponse(request);

    const sessionId = request.uuid.userId;
    const session = await storage.resolve(sessionId);

    await scenarioWalker({ req, res, session });
    await storage.save({ id: sessionId, session });

    return res.message;
};
