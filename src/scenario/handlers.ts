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

export const test: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const {num1, num2} = req.variables
    const ans = Number(num1) + Number(num2)
    res.setPronounceText(`Ответ ${ans}`);
};

export const chooseSide: SaluteHandler<SaluteRequest> = ({ req, res}) => {
    const {side} = req.variables
    const ans = String(side).toLocaleLowerCase()
    if (ans === 'крестики'){
        res.setPronounceText('Я тогда буду за нолики')
        res.appendCommand({type: 'CHOOSE_SIDE', choice: true})
    }
    else if (ans === 'нолики'){
        res.setPronounceText('Я тогда буду за крестики')
        res.appendCommand({type: 'CHOOSE_SIDE', choice: false})
    }

    res.appendBubble("Скажите цифру, куда хотите сходить")
};

export const move: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const {index} = req.variables
    const ans = Number(index)
    res.appendCommand({type: 'PLAY', index: ans})
};

export const restart: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.appendCommand({type: 'RESET'})
};

