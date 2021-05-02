import React from 'react';
import CardHand from './Game/CardHand';
import GameBoard from './Game/GameBoard';
import { LamiGameProvider } from './Game/lamiGameContext';

const App: React.FunctionComponent = () => {
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

export default App;
