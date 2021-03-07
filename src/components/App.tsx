import React, { useRef } from 'react';
import LamiGame from '../game/lamiGame';
import CardHand from './Game/CardHand';
import GameBoard from './Game/GameBoard';

const App: React.FunctionComponent = () => {
    const lamiGame = useRef(new LamiGame(0, 4));

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <GameBoard />
            <CardHand cards={lamiGame.current.myCards} />
        </div>
    );
};

export default App;
