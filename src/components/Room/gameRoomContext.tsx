import React, { useState } from 'react';
import { Player } from '../../models/player';

export interface IGameRoomContext {
    players: Player[];
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

export const GameRoomContext = React.createContext<IGameRoomContext>({
    players: [],
    setPlayers: () => {},
});

export const GameRoomProvider: React.FunctionComponent = (props) => {
    const [players, setPlayers] = useState<Player[]>([]);

    return (
        <GameRoomContext.Provider value={{ players, setPlayers }}>
            {props.children}
        </GameRoomContext.Provider>
    );
};
