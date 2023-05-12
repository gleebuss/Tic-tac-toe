import { createMatchers, SaluteHandler, SaluteRequest } from '@salutejs/scenario';


export const runAppHandler: SaluteHandler = ({ res }) => {
    res.appendSuggestions(['Крестики', 'Нолики']);
    res.setPronounceText('Привет, за кого будешь играть?');
    
};

export const noMatchHandler: SaluteHandler = ({ res }) => {
    res.setPronounceText('Я не понимаю');
    res.appendBubble('Я не понимаю');
};

export const closeAppHander: SaluteHandler = ({ res }) => {
    res.setPronounceText('Спасибо за игру');
};

export const winner: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const {winner, user} = req.variables;

    if (winner === user) {
        res.setEmotion("pechal")
        res.setPronounceText(`Вы победили`);
        res.appendBubble('Вы победили')
    }
    else {
        res.setEmotion("pechal")
        res.setPronounceText(`Вы проиграли`)
        res.appendBubble('Вы проиграли')
    }
};

export const side: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const {choice} = req.variables;
    if (choice === 'true') {
        res.appendBubble("Я тогда за нолики")
        res.setPronounceText("Я тогда за нолики")
    }
    else{
        res.appendBubble("Я тогда за крестики")
        res.setPronounceText("Я тогда за крестики")
    }
};

export const chooseSide: SaluteHandler<SaluteRequest> = ({ req, res}) => {
    const {side} = req.variables
    const ans = String(side).toLocaleLowerCase()
    if (ans === 'крестики'){
        res.appendCommand({type: 'CHOOSE_SIDE', choice: true})
    }
    else if (ans === 'нолики'){
        res.appendCommand({type: 'CHOOSE_SIDE', choice: false})
    }
};

export const move: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const {index} = req.variables
    const ans = Number(index)
    res.appendCommand({type: 'PLAY', index: ans})
};

export const restart: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.appendCommand({type: 'RESET'})
};

