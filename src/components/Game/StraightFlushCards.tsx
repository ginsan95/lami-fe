import React, { useRef } from 'react';
import { allCardNumbers, Card, CardNumber } from '../../models/card';
import CardComponent from './CardComponent';
import styles from './StraightFlushCards.module.sass';
import useContainerSize from '../../hooks/useContainerSize';

type Position = 'top' | 'left' | 'right' | 'bottom';

interface StraightFlushCardsProps {
    playedCards: Card[][];
    width: string | number;
    height: string | number;
    position: Position;
    onClick?: (cards: Card[], insertPosition: 'start' | 'end') => void;
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
    const { playedCards, position, width, height, onClick } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    const { width: containerWidth, height: containerHeight } = useContainerSize(
        containerRef
    );

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
                {playedCards.map((cards, index) => (
                    <div key={index} className={styles.cards_container}>
                        {cards.map((card, index) => {
                            const clickable =
                                cards.length < allCardNumbers.length &&
                                card.number !== CardNumber.ace &&
                                (index === 0 || index === cards.length - 1);
                            const handleClick = () => {
                                if (clickable && onClick) {
                                    onClick(
                                        cards,
                                        index === 0 ? 'start' : 'end'
                                    );
                                }
                            };

                            return (
                                <CardComponent
                                    key={card.number}
                                    card={card}
                                    height={50}
                                    width={30}
                                    clickable={clickable}
                                    onClick={handleClick}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StraightFlushCards;
