import React from 'react'
import { useReducer, useRef, useEffect } from 'react';
import { initialState, playBotMove, calculateWinner } from '../game_logic/GameFunc.ts';
import styles from '../styles/App.module.css';
import Board from '../components/Board.jsx';
import ChooseSideMenu from '../components/ChooseSideMenu.jsx';
import Status from '../components/Status.jsx';
import {
    AssistantAppState,
    AssistantClientCommand,
    createAssistant,
    createSmartappDebugger,
} from '@salutejs/client';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
// eslint-disable-next-line prefer-destructuring
const NEXT_PUBLIC_DEV_TOKEN = process.env.NEXT_PUBLIC_DEV_TOKEN;
// eslint-disable-next-line prefer-destructuring
const NEXT_PUBLIC_DEV_PHRASE = process.env.NEXT_PUBLIC_DEV_PHRASE;

export default function Home() {
    const assistantStateRef = useRef<AssistantAppState>({});
    const assistantRef = useRef<ReturnType<typeof createAssistant>>();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { board, next, botSide, playerSide, winner, isSideMenuOpen, isStatusOpen, audio, playing, screen } = state;

    useEffect(() => {
        if (next === 'BOT' && winner === null) {
            const botMove = playBotMove(board, botSide, playerSide);
            dispatch({ type: 'PLAY', index: botMove });
        }
    }, [next]);

    useEffect(() => {
        if (winner !== null || board.every((square: any) => square !== null)) {
            dispatch({ type: 'STATUS', flag: true });
            assistantRef.current?.sendAction({ type: 'winner', payload: { winner: winner, user: playerSide } });
        }
    }, [winner]);

    useEffect(() => {
        if (botSide !== null && playerSide !== null) {
            dispatch({ type: 'SIDEMENU', flag: false });
            assistantRef.current?.sendAction({ type: 'side', payload: { choice: playerSide === 'X' ? true : false } })

        }
    }, [botSide, playerSide]);

    function reducer(state: any, action: any): any {
        switch (action.type) {
            case 'RESET':
                state.audio?.pause();
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
                        playing: true,
                        screen: 'Mid',
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
                    playing: false,
                    screen: 'End',
                }
            case 'help':
                assistantRef.current?.sendAction({
                    type: 'parseScreen', payload: {
                        screen: state.screen
                    }
                })
                return {
                    ...state,
                }
            default:
                return {
                    ...state,
                }
        }
    }

    useEffect(() => {
        if (playing === true) {
            audio.play();
        }
        else if (playing === false) {
            audio.pause();
        }
    }, [playing]);

    function handleReset() {
        assistantRef.current?.sendAction({ type: 'button_restart' })
    }

    function handlePlay(index: any): void {
        dispatch({ type: 'PLAY', index: index });
    }

    function chooseSide(choice: any): void {
        assistantRef.current?.sendAction({
            type: 'button_chooseSide', payload: {
                choice: choice
            }
        })
    }

    function handleModalClose(): void {
        dispatch({ type: 'SIDEMENU', flag: false });
    }

    // function checkScreen(): String {
    //     const screens: string[] = ["Early", "Mid", "End"];
    //     if (playerSide === null || botSide === null) {
    //         return screens[0]
    //     }
    //     else if (winner === null) {
    //         return screens[1]
    //     }
    //     else {
    //         return screens[2]
    //     }
    // }

    function handleHelp(): void {
        assistantRef.current?.sendAction({
            type: 'parseScreen', payload: {
                screen: screen
            }
        })
    }

    useEffect(() => {
        const initializeAssistant = () => {
            if (!IS_DEVELOPMENT) {
                return createAssistant({
                    getState: () => assistantStateRef.current,
                });
            }

            if (!NEXT_PUBLIC_DEV_TOKEN || !NEXT_PUBLIC_DEV_PHRASE) {
                throw new Error('');
            }

            // return createSmartappDebugger({
            //     token: NEXT_PUBLIC_DEV_TOKEN,
            //     initPhrase: NEXT_PUBLIC_DEV_PHRASE,
            //     getState: () => assistantStateRef.current,
            //     nativePanel: {
            //         defaultText: 'Покажи что-нибудь',
            //         screenshotMode: false,
            //         tabIndex: -1,
            //     },
            // });

            return createAssistant({
                getState: () => assistantStateRef.current,
            });
        };

        const assistant = initializeAssistant();
        assistant.on('data', (command: AssistantClientCommand) => {
            switch (command.type) {
                case 'smart_app_data':
                    dispatch(command.smart_app_data)
                    break;
                default:
                    break;
            }
        });
        assistantRef.current = assistant;
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.All}>
                {isSideMenuOpen && <ChooseSideMenu onClose={handleModalClose} chooseSide={chooseSide} />}
                {isStatusOpen && <Status handleReset={handleReset} winner={winner} />}
                <Board board={board} handlePlay={handlePlay} />
                <div className={styles['button-container']}>
                    <button onClick={handleReset}>Новая игра</button>
                    <button onClick={handleHelp}>Помощь</button>
                </div>
            </div>
        </div>
    );
}
