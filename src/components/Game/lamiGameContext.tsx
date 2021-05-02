import React, { useCallback, useRef, useState } from 'react';
import LamiGame from '../../game/lamiGame';
import { KeyedCard } from '../../hooks/useKeyedCards';

type SelectedCards = {
    [key: string]: KeyedCard;
};

export interface ILamiGameContext {
    game: LamiGame;
    round: number;
    increaseRound: () => void;
    selectedCards: SelectedCards;
    setSelectedCards: React.Dispatch<React.SetStateAction<SelectedCards>>;
}

export const LamiGameContext = React.createContext<ILamiGameContext>({
    game: new LamiGame(0, 4),
    round: 1,
    increaseRound: () => {},
    selectedCards: {},
    setSelectedCards: () => {},
});

export const LamiGameProvider: React.FunctionComponent = ({ children }) => {
    const lamiGame = useRef(new LamiGame(0, 4));

    const [round, setRound] = useState(1);
    const [selectedCards, setSelectedCards] = useState({});

    const increaseRound = useCallback(() => {
        setRound((round) => round + 1);
    }, []);

    return (
        <LamiGameContext.Provider
            value={{
                game: lamiGame.current,
                round,
                increaseRound,
                selectedCards,
                setSelectedCards,
            }}
        >
            {children}
        </LamiGameContext.Provider>
    );
};
