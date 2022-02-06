import React, { useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../models/card';
import styles from './ScoreBoard.module.sass';
import { Button, Divider, Paper } from '@material-ui/core';
import { GameRoomContext } from '../Room/gameRoomContext';
import PlayersScore from './PlayersScore';

interface LocationState {
    isHost?: boolean;
    playerNum?: number;
    cards?: Card[];
}

const ScoreBoard: React.FunctionComponent = () => {
    const { playerNum, cards, isHost = false } =
        useLocation<LocationState>().state ?? {};
    const { players } = useContext(GameRoomContext);

    const [allCards, setAllCards] = useState(() => {
        if (playerNum !== undefined && cards !== undefined) {
            const array: Card[][] = [];
            array[playerNum] = cards;
            return array;
        }
        return [];
    });

    const isAllReady =
        allCards.filter((cards) => cards).length === players.length;

    return (
        <div className={styles.container}>
            <Paper elevation={2} className={styles.content_container}>
                <h1>Score Board</h1>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <PlayersScore players={players} allCards={allCards} />
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!isAllReady}
                >
                    Play Again
                </Button>
            </Paper>
        </div>
    );
};

export default ScoreBoard;
