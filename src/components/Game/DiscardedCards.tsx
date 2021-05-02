import React, { useCallback, useMemo } from 'react';
import { Card } from '../../models/card';
import styles from './DiscardedCards.module.sass';
import CardComponent from './CardComponent';
import useKeyedCards from '../../hooks/useKeyedCards';
import useLamiGame from './useLamiGame';

const DiscardedCards: React.FunctionComponent = () => {
    const { game } = useLamiGame();
    const playedCards = Object.values(game.discardedCards);

    const sortedCards = useMemo(
        () =>
            playedCards.sort(
                (c1, c2) => (c1 ? c1[0].number : 0) - (c2 ? c2[0].number : 0)
            ),
        [playedCards]
    );

    return (
        <div className={styles.container}>
            {sortedCards.map((cards, index) => (
                <MyCards
                    key={cards ? cards[0].number : index}
                    cards={cards ?? []}
                />
            ))}
        </div>
    );
};

interface MyCardsProps {
    cards: Card[];
}

const MyCards: React.FunctionComponent<MyCardsProps> = (props) => {
    const { cards } = props;
    const sortCards = useCallback(
        (c1: Card, c2: Card) => c1.suit - c2.suit,
        []
    );
    const keyedCards = useKeyedCards(cards, sortCards);

    return (
        <div className={styles.cards_container}>
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
