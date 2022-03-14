import React from 'react';
import styles from './GameBoard.module.sass';
import StraightFlushCards from './StraightFlushCards';
import DiscardedCards from './DiscardedCards';
import useLamiGame from './useLamiGame';

function getRowsSpace(row: number) {
    return 50 * row + 8 * (row - 1);
}

const verticalWidth = getRowsSpace(
    window.innerHeight > window.innerWidth ? 1 : 2
);
const horizontalHeight = getRowsSpace(
    window.innerHeight > window.innerWidth ? 2 : 1
);

const GameBoard: React.FunctionComponent = () => {
    const { game } = useLamiGame();

    return (
        <div className={styles.container}>
            {game.playersCount >= 4 && (
                <StraightFlushCards
                    tableNum={game.getTableNumber('left')}
                    height="100%"
                    width={verticalWidth}
                    position="left"
                />
            )}
            <div className={styles.center_area}>
                <StraightFlushCards
                    tableNum={game.getTableNumber('top')}
                    height={horizontalHeight}
                    width="100%"
                    position="top"
                />
                <DiscardedCards />
                <StraightFlushCards
                    tableNum={game.getTableNumber('bottom')}
                    height={horizontalHeight}
                    width="100%"
                    position="bottom"
                />
            </div>
            <StraightFlushCards
                tableNum={game.getTableNumber('right')}
                height="100%"
                width={verticalWidth}
                position="right"
            />
        </div>
    );
};

export default GameBoard;
