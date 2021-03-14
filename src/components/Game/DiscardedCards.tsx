import React, { useCallback, useMemo } from 'react';
import { allCardSuits, Card } from '../../models/card';
import styles from './DiscardedCards.module.sass';
import CardComponent from './CardComponent';
import useKeyedCards from '../../hooks/useKeyedCards';

interface DiscardedCardsProps {
    playedCards: Card[][];
    onClick?: (cards: Card[]) => void;
}

const DiscardedCards: React.FunctionComponent<DiscardedCardsProps> = (
    props
) => {
    const { playedCards, onClick } = props;
    const sortedCards = useMemo(
        () => playedCards.sort((c1, c2) => c1[0].number - c2[0].number),
        [playedCards]
    );

    return (
        <div className={styles.container}>
            {sortedCards.map((cards) => (
                <MyCards
                    key={cards[0].number}
                    cards={cards}
                    onClick={onClick}
                />
            ))}
        </div>
    );
};

interface MyCardsProps {
    cards: Card[];
    onClick?: (cards: Card[]) => void;
}

const MyCards: React.FunctionComponent<MyCardsProps> = (props) => {
    const { cards, onClick } = props;
    const sortCards = useCallback(
        (c1: Card, c2: Card) => c1.suit - c2.suit,
        []
    );
    const keyedCards = useKeyedCards(cards, sortCards);
    // Max is 8 cards
    const clickable = cards.length < allCardSuits.length * 2;

    return (
        <div
            className={styles.cards_container}
            style={clickable ? { cursor: 'pointer' } : undefined}
            onClick={clickable && onClick ? () => onClick(cards) : undefined}
        >
            {keyedCards.map((card) => (
                <CardComponent
                    key={card.key}
                    card={card}
                    height={50}
                    width={30}
                />
            ))}
        </div>
    );
};

export default DiscardedCards;
