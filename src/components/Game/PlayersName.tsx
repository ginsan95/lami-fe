import React, { useContext } from 'react';
import styles from './PlayersName.module.sass';
import { GameRoomContext } from '../Room/gameRoomContext';
import useLamiGame from './useLamiGame';

const PlayersName: React.FunctionComponent = () => {
    return (
        <div className={styles.container}>
            <Name position="top" className={styles.top} />
            <Name position="left" className={styles.left} />
            <Name position="bottom" className={styles.bottom} />
            <Name position="right" className={styles.right} />
        </div>
    );
};

interface NameProps {
    position: 'top' | 'right' | 'left' | 'bottom';
    className: string;
}

const Name: React.FunctionComponent<NameProps> = (props) => {
    const { position, className } = props;
    const { players } = useContext(GameRoomContext);
    const { game } = useLamiGame();

    const tableNum = game.getTableNumber(position);
    const name = `${players[tableNum]?.name} (${game.playersCardCount[tableNum]})`;
    let color: string | undefined = undefined;
    if (game.deadPlayers.has(tableNum)) {
        color = 'gray';
    } else if (game.playerNumTurn === tableNum) {
        color = 'green';
    }

    return (
        <div
            className={className}
            style={color !== undefined ? { color } : undefined}
        >
            {name}
        </div>
    );
};

export default PlayersName;
