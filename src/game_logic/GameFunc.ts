export const initialState = {
    board: Array(25).fill(null),
    next: null,
    botSide: null,
    playerSide: null,
    winner: null,
    isSideMenuOpen: true,
    isStatusOpen: false,
    audio: null,
    playing: null
};

export function reducer(state: any, action: any) {
    switch (action.type) {
        case 'RESET':
            state.audio.pause();
            return initialState;
        case 'PLAY':
            if (state.board[action.index] || state.winner) {
                return {
                    ...state
                }
            }
            else {
                const newBoard = [...state.board];
                newBoard[action.index] = state.next === 'PLAYER' ? state.playerSide : state.botSide;
                const winner = calculateWinner(newBoard);
                return {
                    ...state,
                    board: newBoard,
                    next: state.next === 'PLAYER' ? 'BOT' : 'PLAYER',
                    winner: winner,
                };
            }

        case 'CHOOSE_SIDE':
            if (state.botSide === null && state.playerSide === null) {
                const botSide = action.payload.choice === false ? 'X' : 'O'
                const playerSide = action.payload.choice === true ? 'X' : 'O'
                const next = botSide === 'X' ? 'BOT' : 'PLAYER'
                return {
                    ...state,
                    botSide: botSide,
                    playerSide: playerSide,
                    next: next,
                    audio: new Audio('/asia.mp3'),
                    playing: true
                };
            }
            else {
                return {
                    ...state,
                };
            }

        case 'SIDEMENU':
            return {
                ...state,
                isSideMenuOpen: action.flag
            }
        case 'STATUS':
            return {
                ...state,
                isStatusOpen: action.flag,
                playing: false
            }
        default:
            throw new Error(`Invalid action type: ${action.type}`);
    }
}

export function calculateWinner(board: any) {
    const lines = [    // Horizontal lines
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [6, 7, 8, 9],
        [10, 11, 12, 13],
        [11, 12, 13, 14],
        [15, 16, 17, 18],
        [16, 17, 18, 19],
        [20, 21, 22, 23],
        [21, 22, 23, 24],
        // Vertical lines
        [0, 5, 10, 15],
        [5, 10, 15, 20],
        [1, 6, 11, 16],
        [6, 11, 16, 21],
        [2, 7, 12, 17],
        [7, 12, 17, 22],
        [3, 8, 13, 18],
        [8, 13, 18, 23],
        [4, 9, 14, 19],
        [9, 14, 19, 24],
        // Diagonal lines
        [0, 6, 12, 18],
        [6, 12, 18, 24],
        [1, 7, 13, 19],
        [5, 11, 17, 23],
        [3, 7, 11, 15],
        [9, 13, 17, 21],
        [4, 8, 12, 16],
        [8, 12, 16, 20],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d] = lines[i];
        if (board[a] && board[a] === board[b] && board[b] === board[c] && board[c] === board[d]) {
            return board[a];
        }
    }

    if (board.every((square: any) => square !== null)) {
        return 'DRAW';
    }

    return null;
}
export function playBotMove(board: any, currentPlayer: any, otherPlayer: any) {
    const availableMoves = board.reduce((moves: any, square: any, index: any) => {
        if (square === null) {
            return [...moves, index];
        }
        return moves;
    }, []);

    for (let i = 0; i < availableMoves.length; i++) {
        const newBoard = [...board];
        newBoard[availableMoves[i]] = currentPlayer;
        const winner = calculateWinner(newBoard);
        if (winner === currentPlayer) {
            return availableMoves[i];
        }
    }

    for (let i = 0; i < availableMoves.length; i++) {
        const newBoard = [...board];
        newBoard[availableMoves[i]] = otherPlayer;
        const winner = calculateWinner(newBoard);
        if (winner === otherPlayer) {
            return availableMoves[i];
        }
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}