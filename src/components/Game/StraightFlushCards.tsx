import React, { useRef } from 'react';
import styles from './StraightFlushCards.module.sass';
import useContainerSize from '../../hooks/useContainerSize';
import useLamiGame from './useLamiGame';
import StraightFlushCardsRow from './StraightFlushCardsRow';

type Position = 'top' | 'left' | 'right' | 'bottom';

interface StraightFlushCardsProps {
    tableNum: number;
    width: string | number;
    height: string | number;
    position: Position;
}

const positionToDegree = {
    top: 180,
    right: 270,
    bottom: 0,
    left: 90,
};

const StraightFlushCards: React.FunctionComponent<StraightFlushCardsProps> = (
    props
) => {
    const { tableNum, position, width, height } = props;

    const { game, playStraightFlushCards } = useLamiGame();
    const playedCards = game.straightFlushCards[tableNum];

    const containerRef = useRef<HTMLDivElement>(null);

    const { width: containerWidth, height: containerHeight } = useContainerSize(
        containerRef
    );

    const handleClick = (row: number, insertPosition: 'start' | 'end') => {
        playStraightFlushCards({
            table: { tableNum, row },
            insertPosition,
        });
    };

    let style: React.CSSProperties = {
        transform: `rotate(${positionToDegree[position]}deg)`,
    };
    switch (position) {
        case 'left':
        case 'right': {
            const offset = containerHeight / 2 - containerWidth / 2;
            style = {
                ...style,
                width: containerHeight,
                height: containerWidth,
                top: offset,
                right: -offset,
            };
            break;
        }
        case 'top':
        case 'bottom': {
            style = {
                ...style,
                width: containerWidth,
                height: containerHeight,
                top: 0,
                left: 0,
            };
            break;
        }
    }

    return (
        <div ref={containerRef} style={{ width, height, position: 'relative' }}>
            <div className={styles.multi_cards_container} style={style}>
                {playedCards.map((cards, row) => (
                    <StraightFlushCardsRow
                        key={row}
                        game={game}
                        cards={cards}
                        row={row}
                        onClick={handleClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default StraightFlushCards;
