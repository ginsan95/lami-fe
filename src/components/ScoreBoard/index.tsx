import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Card } from '../../models/card';
import styles from './ScoreBoard.module.sass';
import { Button, Divider, Paper } from '@material-ui/core';
import PlayersScore from './PlayersScore';
import MessageHandler, { IMessageHandler } from '../../utils/messageHandler';
import roomManager from '../../utils/roomManager2';
import { MessageType } from '../../models/message';
import * as scoreBoardActions from '../../actions/scoreBoard';
import useGameRoom from '../Room/useGameRoom';
import routeURLs from '../Routes/urls';

interface LocationState {
    isHost?: boolean;
    playerNum?: number;
    cards?: Card[];
}

const ScoreBoard: React.FunctionComponent = () => {
    const { playerNum, cards, isHost = false } =
        useLocation<LocationState>().state ?? {};
    const history = useHistory();
    const { players, startGame } = useGameRoom();

    const [allCards, setAllCards] = useState(() => {
        if (playerNum !== undefined && cards) {
            const array: Card[][] = [];
            array[playerNum] = cards;
            return array;
        }
        return [];
    });

    const messageHandler = useRef<IMessageHandler>(new MessageHandler());

    // Setup message handler && send initial message.
    useEffect(() => {
        roomManager.messageHandler = messageHandler.current as MessageHandler;
        if (playerNum !== undefined && cards) {
            roomManager.sendMessage(
                scoreBoardActions.calculatePlayerScore({ playerNum, cards })
            );
        }
        return () => (roomManager.messageHandler = undefined);
    }, [playerNum, cards]);

    // Common message handler. Host and client share the same.
    useEffect(() => {
        const handler = messageHandler.current;

        handler.on(MessageType.CALCULATE_PLAYER_SCORE, (payload) => {
            if (payload.playerNum === playerNum) return;
            // Add the cards for calculation and display.
            setAllCards((allCards) => {
                const newCards = [...allCards];
                newCards[payload.playerNum] = payload.cards;
                return newCards;
            });
            // Inform other players about this for host.
            if (isHost) {
                roomManager.sendMessage(
                    scoreBoardActions.calculatePlayerScore(payload)
                );
            }
        });
    }, [isHost, playerNum]);

    // Client message handler
    useEffect(() => {
        if (isHost) return;

        const handler = messageHandler.current;

        handler.on(MessageType.START_GAME, (payload) => {
            const { playerNum: myPlayerNum, cards } = payload;
            if (myPlayerNum !== playerNum) return;

            // Transition to game screen
            history.push(routeURLs.GAME, {
                playerNum: myPlayerNum,
                cards,
                isHost,
            });
        });
    }, [isHost, history, playerNum]);

    const isAllReady =
        allCards.filter((cards) => cards).length === players.length;

    return (
        <div className={styles.container}>
            <Paper elevation={2} className={styles.content_container}>
                <h1>Score Board</h1>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <PlayersScore players={players} allCards={allCards} />
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                {isHost && (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!isAllReady}
                        onClick={startGame}
                    >
                        Play Again
                    </Button>
                )}
            </Paper>
        </div>
    );
};

export default ScoreBoard;
