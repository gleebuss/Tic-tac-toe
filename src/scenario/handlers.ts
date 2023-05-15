import { SaluteHandler, SaluteRequest } from '@salutejs/scenario';


export const runAppHandler: SaluteHandler = ({ req, res, session, history }) => {
    let off = req.character === 'joy' ? ['я с тобой сыграю', 'ты будешь'] : ['мы с вами сыграем', 'Вы будете']
    res.setPronounceText(`Сегодня ${off[0]} в крестики нолики. За кого ${off[1]} играть?`);
    res.appendSuggestions(['Крестики', 'Нолики']);
};

export const noMatchHandler: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.appendCommand({type: 'help'})
};

export const closeAppHander: SaluteHandler = ({ req, res }) => {
    res.setPronounceText('Спасибо за игру');
};

export const start: SaluteHandler = ({ req, res }) => {
    res.appendSuggestions(['Крестики', 'Нолики']);
    let off = req.character === 'joy' ? 'ты будешь' : 'Вы будете'
    res.setPronounceText(`За кого ${off} играть?`);
};

export const winner: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { winner, user } = req.variables;

    if (winner === user) {
        let off = req.character === 'joy' ? 'ты победил' : 'Вы победили'
        res.setEmotion("radost")
        res.setPronounceText(`Поздравляю, ${off}`);
    }
    else if (winner === 'DRAW') {
        res.setEmotion("igrivost")
        res.setPronounceText(`Ничья`);
        res.appendBubble('Ничья')
    }
    else {
        let off = req.character === 'joy' ? 'Ты проиграл, попробуй' : 'Вы проиграли, попробуйте'
        res.setEmotion("pechal")
        res.setPronounceText(`${off} еще раз`)
    }
};

export const side: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { choice } = req.variables;
    let off = req.character === 'joy' ? ['Назови', 'хочешь'] : ['Назовите', 'хотите']
    if (String(choice) === 'true') {
        res.appendBubble("Я тогда за нолики.")
        res.setPronounceText(`Я тогда за нолики. ${off[0]} номер клетки, на которую ${off[1]} сходить`)
    }
    else {
        res.appendBubble("Я тогда за крестики.")
        res.setPronounceText(`Я тогда за крестики. ${off[0]} номер клетки, на которую ${off[1]} сходить`)
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
    let off = req.character === 'joy' ? 'ты будешь' : 'Вы будете'
    res.setPronounceText(`За кого ${off} играть?`)
};

export const parseScreen: SaluteHandler<SaluteRequest> = ({req, res}) => {
    const {screen} = req.variables
    if (screen === 'Early') {
        let off = req.character === 'joy' ? ['Скажи', 'будешь'] : ['Скажите', 'будете']
        res.appendSuggestions(['Крестики', 'Нолики']);
        res.setPronounceText(`${off[0]} кем ${off[1]} играть. Крестики или нолики.`)
    }
    else if (screen === 'Mid') {
        let off = req.character === 'joy' ? ['Скажи','хочешь'] : ['Скажите','хотите']
        res.setPronounceText(`${off[0]} номер ячейки на которую ${off[1]} сходить.`)
    }
    else {
        let off = req.character === 'joy' ? 'Скажи' : 'Скажите'
        res.setPronounceText(`${off} заново и игра начнется сначала.`)
    }
}