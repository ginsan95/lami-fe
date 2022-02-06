import React, { useRef } from 'react';
import { LamiGameProvider } from './lamiGameContext';
import GameBoard from './GameBoard';
import CardHand from './CardHand';
import { useLocation } from 'react-router-dom';
import LamiGame from '../../game/lamiGame';
import { Card } from '../../models/card';

interface LocationState {
    isHost?: boolean;
    playerNum?: number;
    cards?: Card[];
}

const Game: React.FunctionComponent = () => {
    const { playerNum, cards, isHost = false } =
        useLocation<LocationState>().state ?? {};

    const lamiGame = useRef<LamiGame | undefined>(
        playerNum !== undefined && cards
            ? new LamiGame(playerNum, cards)
            : undefined
    );

    if (!lamiGame.current || playerNum === undefined || isHost === undefined) {
        return <>Error: Missing Game</>;
    }

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <LamiGameProvider
                game={lamiGame.current}
                playerNum={playerNum}
                isHost={isHost}
            >
                <GameBoard />
                <CardHand />
            </LamiGameProvider>
        </div>
    );
};

export default Game;
