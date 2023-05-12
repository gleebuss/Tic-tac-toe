import React, { Component } from 'react'
import { useReducer, useState, useRef, useEffect } from 'react';
import { initialState, reducer, playBotMove } from '../game_logic/GameFunc.ts';
import styles from '../styles/App.module.css';
import Board from '../components/Board.jsx';
import ChooseSideMenu from '../components/ChooseSideMenu.jsx';
import Status from '../components/Status.jsx';
import {
    AssistantAppState,
    AssistantClientCommand,
    AssistantNavigationCommand,
    CharacterId,
    createAssistant,
    createSmartappDebugger,
} from '@salutejs/client';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
// eslint-disable-next-line prefer-destructuring
const NEXT_PUBLIC_DEV_TOKEN = process.env.NEXT_PUBLIC_DEV_TOKEN;
// eslint-disable-next-line prefer-destructuring
const NEXT_PUBLIC_DEV_PHRASE = process.env.NEXT_PUBLIC_DEV_PHRASE;

export default function Home() {
    const [character, setCharacter] = useState<CharacterId>('sber' as const);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { board, next, botSide, playerSide, winner, isSideMenuOpen, isStatusOpen, audio, playing} = state;

    useEffect(() => {
        if (next === 'BOT' && winner === null) {
            const botMove = playBotMove(board, botSide, playerSide);
            dispatch({ type: 'PLAY', index: botMove });
        }
    }, [next]);

    useEffect(() => {
        if (winner !== null || board.every((square:any) => square !== null)) {
            dispatch({ type: 'STATUS', flag: true });
            assistantRef.current?.sendAction({type:'winner', payload: {winner: winner, user: playerSide}});
        }
    }, [winner]);

    useEffect(() => {
        if (botSide !== null && playerSide !== null) {
            dispatch({ type: 'SIDEMENU', flag: false });
        }
    }, [botSide, playerSide]);

    useEffect(() => {
        if (playing === true) {
            audio.play();
        }
        else if (playing === false) {
            audio.pause();
        }
    }, [playing]);


    function handleReset() {
        dispatch({ type: 'RESET' });
    }

    function handlePlay(index:any) {
        dispatch({ type: 'PLAY', index: index });
    }

    function chooseSide(choice:any) {
        dispatch({ type: 'CHOOSE_SIDE', choice: choice })
    }

    function handleModalClose() {
        dispatch({ type: 'SIDEMENU', flag: false });
    }

    const assistantStateRef = useRef<AssistantAppState>({});
    const assistantRef = useRef<ReturnType<typeof createAssistant>>();

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

            return createSmartappDebugger({
                token: NEXT_PUBLIC_DEV_TOKEN,
                initPhrase: NEXT_PUBLIC_DEV_PHRASE,
                getState: () => assistantStateRef.current,
                nativePanel:{
                    screenshotMode: false
                }
            });
        };

        const assistant = initializeAssistant();

        assistant.on('data', (command: AssistantClientCommand) => {
            let navigation: AssistantNavigationCommand['navigation'];
            switch (command.type) {
                case 'character':
                    setCharacter(command.character.id);
                    // 'sber' | 'eva' | 'joy';
                    break;
                case 'navigation':
                    navigation = (command as AssistantNavigationCommand).navigation;
                    break;
                case 'smart_app_data':
                    console.log(command.smart_app_data)
                    if(command.smart_app_data.type === 'CHOOSE_SIDE' && (playerSide === null && botSide === null)) {
                        assistant.sendAction({type: 'side', payload:{choice: command.smart_app_data.payload?.choice }})
                        dispatch(command.smart_app_data)
                    }
                    else{
                        dispatch(command.smart_app_data)
                    }
                    break;
                default:
                    break;
        }});
        assistantRef.current = assistant;
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.All}>
                {isSideMenuOpen && <ChooseSideMenu onClose={handleModalClose} chooseSide={chooseSide} />}
                {isStatusOpen && <Status handleReset={handleReset} winner={winner} />}
                <Board board={board} handlePlay={handlePlay} />
                <div className={styles['button-container']}>
                    <button onClick={handleReset}>Reset</button>
                </div>
            </div>
        </div>
    );
}
