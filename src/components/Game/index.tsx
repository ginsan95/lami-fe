import React, { useRef } from 'react';
import { LamiGameProvider } from './lamiGameContext';
import GameBoard from './GameBoard';
import CardHand from './CardHand';
import { useLocation } from 'react-router-dom';
import LamiGame from '../../game/lamiGame';
import { Player } from '../../models/player';
import { Card } from '../../models/card';

interface LocationState {
    player?: Player;
    playerNum?: number;
    cards?: Card[];
}

const Game: React.FunctionComponent = () => {
    const { playerNum, cards } = useLocation<LocationState>().state ?? {};

    const lamiGame = useRef<LamiGame | undefined>(
        playerNum !== undefined && cards
            ? new LamiGame(playerNum, cards)
            : undefined
    );

    if (!lamiGame.current) {
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
            <LamiGameProvider game={lamiGame.current}>
                <GameBoard />
                <CardHand />
            </LamiGameProvider>
        </div>
    );
};

export default Game;
