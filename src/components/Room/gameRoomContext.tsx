import React, { useState } from 'react';
import { Player } from '../../models/player';

export interface IGameRoomContext {
    players: Player[];
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    totalWins: number[];
    setTotalWins: React.Dispatch<React.SetStateAction<number[]>>;
}

export const GameRoomContext = React.createContext<IGameRoomContext>({
    players: [],
    setPlayers: () => {},
    totalWins: [],
    setTotalWins: () => {},
});

export const GameRoomProvider: React.FunctionComponent = (props) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [totalWins, setTotalWins] = useState<number[]>([]);

    return (
        <GameRoomContext.Provider
            value={{ players, setPlayers, totalWins, setTotalWins }}
        >
            {props.children}
        </GameRoomContext.Provider>
    );
};
