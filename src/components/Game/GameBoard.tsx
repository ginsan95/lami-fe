import React from 'react';
import styles from './GameBoard.module.sass';
import StraightFlushCards from './StraightFlushCards';
import DiscardedCards from './DiscardedCards';
import useLamiGame from './useLamiGame';

const verticalWidth = 50 * 3 + 8 * 2;
const horizontalHeight = 50 * 2 + 8;

const GameBoard: React.FunctionComponent = () => {
    const { game } = useLamiGame();

    return (
        <div className={styles.container}>
            <StraightFlushCards
                tableNum={game.getTableNumber('left')}
                height="100%"
                width={verticalWidth}
                position="left"
            />
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
