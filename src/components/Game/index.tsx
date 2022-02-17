import React, { useRef } from 'react';
import { LamiGameProvider } from './lamiGameContext';
import GameBoard from './GameBoard';
import CardHand from './CardHand';
import { useLocation } from 'react-router-dom';
import LamiGame from '../../game/lamiGame';
import { Card } from '../../models/card';
import { isDev } from '../../utils/devUtils';
import Deck from '../../game/deck';

interface LocationState {
    isHost?: boolean;
    playerNum?: number;
    cards?: Card[];
    startingPlayerNum?: number;
    playersCount?: 3 | 4;
}

function getFallbackGame() {
    if (isDev()) {
        const cards = new Deck().getCards(0);
        return new LamiGame(0, cards, 0, 4);
    }
    return undefined;
}

const Game: React.FunctionComponent = () => {
    const {
        playerNum = 0,
        cards,
        startingPlayerNum = 0,
        isHost = false,
        playersCount,
    } = useLocation<LocationState>().state ?? {};

    const lamiGame = useRef<LamiGame | undefined>(
        playerNum !== undefined && cards
            ? new LamiGame(playerNum, cards, startingPlayerNum, playersCount)
            : getFallbackGame()
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
