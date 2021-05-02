import React from 'react';
import styles from './GameBoard.module.sass';
import StraightFlushCards from './StraightFlushCards';
import DiscardedCards from './DiscardedCards';

const verticalWidth = 50 * 3 + 8 * 2;
const horizontalHeight = 50 * 2 + 8;

const GameBoard: React.FunctionComponent = () => {
    return (
        <div className={styles.container}>
            <StraightFlushCards
                tableNum={1}
                height="100%"
                width={verticalWidth}
                position="left"
            />
            <div className={styles.center_area}>
                <StraightFlushCards
                    tableNum={2}
                    height={horizontalHeight}
                    width="100%"
                    position="top"
                />
                <DiscardedCards />
                <StraightFlushCards
                    tableNum={0}
                    height={horizontalHeight}
                    width="100%"
                    position="bottom"
                />
            </div>
            <StraightFlushCards
                tableNum={3}
                height="100%"
                width={verticalWidth}
                position="right"
            />
        </div>
    );
};

export default GameBoard;
