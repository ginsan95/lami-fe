import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import { Card } from '../../models/card';
import * as cardUtils from '../../utils/cardUtils';
import styles from './CardHand.module.sass';
import CardComponent from './CardComponent';
import useContainerSize from '../../hooks/useContainerSize';
import useKeyedCards, { KeyedCard } from '../../hooks/useKeyedCards';

interface CardHandProps {
    cards: Card[];
}

const CARD_HEIGHT = 75;
const CARD_WIDTH = 50;

const CardHand: React.FunctionComponent<CardHandProps> = (props) => {
    const { cards } = props;

    const [sortOrder, setSortOrder] = useState<'number' | 'suit'>('number');
    const [selectedCards, setSelectedCards] = useState<{
        [key: string]: KeyedCard;
    }>({});

    const containerRef = useRef<HTMLDivElement>(null);
    const { width: containerWidth } = useContainerSize(containerRef);

    const sortCards = useCallback(
        (c1: Card, c2: Card) => {
            if (sortOrder === 'suit' && c1.suit !== c2.suit) {
                return c1.suit - c2.suit;
            }
            return cardUtils.compare(c1, c2);
        },
        [sortOrder]
    );

    const keyedCards = useKeyedCards(cards, sortCards);

    const changeSort = () => {
        setSortOrder((order) => {
            if (order === 'suit') {
                return 'number';
            }
            return 'suit';
        });
    };

    const selectCard = (card: KeyedCard) => {
        setSelectedCards((selectedCards) => {
            const clone = { ...selectedCards };
            if (clone[card.key]) {
                delete clone[card.key];
            } else {
                clone[card.key] = card;
            }
            return clone;
        });
    };

    const cardMarginRightNeeded =
        (containerWidth - keyedCards.length * CARD_WIDTH) /
        (keyedCards.length - 1);
    const cardMarginRight = Math.min(cardMarginRightNeeded, 8);

    return (
        <div ref={containerRef} className={styles.container}>
            <div className={styles.cards_container}>
                {keyedCards.map((card, index) => (
                    <CardComponent
                        key={card.key}
                        card={card}
                        height={CARD_HEIGHT}
                        width={CARD_WIDTH}
                        style={{
                            marginRight:
                                index < keyedCards.length - 1
                                    ? cardMarginRight
                                    : 0,
                        }}
                        selected={!!selectedCards[card.key]}
                        clickable
                        onClick={() => selectCard(card)}
                    />
                ))}
            </div>
            <div className={styles.button_container}>
                <Button variant="contained" color="primary">
                    Play
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setSelectedCards({})}
                >
                    Reset Selection
                </Button>
                <Button variant="contained" onClick={changeSort}>
                    Change Sort
                </Button>
            </div>
        </div>
    );
};

export default CardHand;
