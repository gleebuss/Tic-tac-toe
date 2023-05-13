import { createMatchers, SaluteHandler, SaluteRequest } from '@salutejs/scenario';


export const runAppHandler: SaluteHandler = ({ req, res, session, history }) => {
    res.setPronounceText('Сегодня мы с вами сыграем в крестики нолики. За кого Вы будете играть?');
    res.appendSuggestions(['Крестики', 'Нолики']);
    // start({req, res, session, history});
};

export const noMatchHandler: SaluteHandler = ({ req, res }) => {
    res.setPronounceText('Я не понимаю');
    res.appendBubble('Я не понимаю');
};

export const closeAppHander: SaluteHandler = ({ req, res }) => {
    res.setPronounceText('Спасибо за игру');
};

export const start: SaluteHandler = ({ req, res }) => {
    res.appendSuggestions(['Крестики', 'Нолики']);
    res.setPronounceText('За кого Вы будете играть?');
};

export const winner: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { winner, user } = req.variables;

    if (winner === user) {
        res.setEmotion("radost")
        res.setPronounceText(`Поздравляю, Вы победили`);
        res.appendBubble('Вы победили')
    }
    else if (winner === 'DRAW') {
        res.setEmotion("igrivost")
        res.setPronounceText(`Ничья`);
        res.appendBubble('Ничья')
    }
    else {
        res.setEmotion("pechal")
        res.setPronounceText(`Вы проиграли, попробуйте еще раз`)
        res.appendBubble('Вы проиграли, попробуйте еще раз')
    }
};

export const side: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { choice } = req.variables;
    if (String(choice) === 'true') {
        res.appendBubble("Я тогда за нолики")
        res.setPronounceText("Я тогда за нолики")
    }
    else {
        res.appendBubble("Я тогда за крестики")
        res.setPronounceText("Я тогда за крестики")
    }
};

export const chooseSide: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { side } = req.variables
    const ans = String(side).toLocaleLowerCase()
    if (ans === 'крестики') {
        res.appendCommand({ type: 'CHOOSE_SIDE', payload: {choice: true}})
    }
    else if (ans === 'нолики') {
        res.appendCommand({ type: 'CHOOSE_SIDE', payload: {choice: false}})
    }
};

export const button_chooseSide: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { choice } = req.variables
    res.appendCommand({ type: 'CHOOSE_SIDE', payload: {choice: choice }})
};

export const move: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { index } = req.variables
    const ans = Number(index)
    res.appendCommand({ type: 'PLAY', index: ans })
};

export const restart: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.appendCommand({ type: 'RESET' })
    res.appendSuggestions(['Крестики', 'Нолики']);
    res.setPronounceText('За кого Вы будете играть?')
};

