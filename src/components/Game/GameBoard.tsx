import React from 'react';
import styles from './GameBoard.module.sass';
import StraightFlushCards from './StraightFlushCards';
import DiscardedCards from './DiscardedCards';
import useLamiGame from './useLamiGame';

function getRowsSpace(row: number) {
    return 50 * row + 8 * (row - 1);
}

const verticalRows = window.innerHeight > window.innerWidth ? 1 : 2;
const horizontalRows = window.innerHeight > window.innerWidth ? 2 : 1;

const GameBoard: React.FunctionComponent = () => {
    const { game, isDiscardCollapsed } = useLamiGame();

    const verticalWidth = getRowsSpace(
        isDiscardCollapsed ? verticalRows + 1 : verticalRows
    );
    const horizontalHeight = getRowsSpace(
        isDiscardCollapsed ? horizontalRows + 1 : horizontalRows
    );

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
