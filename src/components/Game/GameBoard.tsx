import React, { useRef } from 'react';
import styles from './GameBoard.module.sass';
import StraightFlushCards from './StraightFlushCards';
import DiscardedCards from './DiscardedCards';
import useLamiGame from './useLamiGame';
import useContainerSize from '../../hooks/useContainerSize';

function getRowsSpace(row: number) {
    return 50 * row + 8 * (row - 1);
}

const GameBoard: React.FunctionComponent = () => {
    const { game, isDiscardCollapsed } = useLamiGame();

    const containerRef = useRef<HTMLDivElement>(null);

    const { width: containerWidth, height: containerHeight } = useContainerSize(
        containerRef
    );

    const verticalRows = containerHeight > containerWidth ? 1 : 2;
    const verticalWidth = getRowsSpace(
        isDiscardCollapsed ? verticalRows + 1 : verticalRows
    );

    const horizontalRows = containerHeight > containerWidth ? 2 : 1;
    const horizontalHeight = getRowsSpace(
        isDiscardCollapsed ? horizontalRows + 1 : horizontalRows
    );

    return (
        <div ref={containerRef} className={styles.container}>
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
