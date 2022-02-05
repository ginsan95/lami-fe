import React, { useCallback, useState } from 'react';
import LamiGame from '../../game/lamiGame';
import { KeyedCard } from '../../hooks/useKeyedCards';

type SelectedCards = {
    [key: string]: KeyedCard;
};

export interface ILamiGameContext {
    game: LamiGame;
    round: number;
    nextTurn: () => void;
    selectedCards: SelectedCards;
    setSelectedCards: React.Dispatch<React.SetStateAction<SelectedCards>>;
}

export const LamiGameContext = React.createContext<ILamiGameContext>({
    game: new LamiGame(0, []),
    round: 1,
    nextTurn: () => {},
    selectedCards: {},
    setSelectedCards: () => {},
});

interface LamiGameProviderProps {
    game: LamiGame;
}

export const LamiGameProvider: React.FunctionComponent<LamiGameProviderProps> = ({
    children,
    game,
}) => {
    const [round, setRound] = useState(1);
    const [selectedCards, setSelectedCards] = useState({});

    const nextTurn = useCallback(() => {
        // Change the player turn.
        game.nextTurn();
        // Increase the round to regenerate the UI.
        setRound((round) => round + 1);
    }, [game]);

    return (
        <LamiGameContext.Provider
            value={{
                game,
                round,
                nextTurn,
                selectedCards,
                setSelectedCards,
            }}
        >
            {children}
        </LamiGameContext.Provider>
    );
};
