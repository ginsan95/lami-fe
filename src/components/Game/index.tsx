import React from 'react';
import { LamiGameProvider } from './lamiGameContext';
import GameBoard from './GameBoard';
import CardHand from './CardHand';

const Game: React.FunctionComponent = () => {
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <LamiGameProvider>
                <GameBoard />
                <CardHand />
            </LamiGameProvider>
        </div>
    );
};

export default Game;
