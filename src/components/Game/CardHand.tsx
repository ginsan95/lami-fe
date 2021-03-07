import React, { useMemo, useState } from 'react';
import { Button, ButtonBase } from '@material-ui/core';
import { Card } from '../../models/card';
import * as cardUtils from '../../utils/cardUtils';
import styles from './CardHand.module.sass';

interface CardHandProps {
    cards: Card[];
}

interface MyCard extends Card {
    key: string;
}

const CardHand: React.FunctionComponent<CardHandProps> = (props) => {
    const { cards } = props;

    const [sortOrder, setSortOrder] = useState<'number' | 'suit'>('number');
    const [selectedCards, setSelectedCards] = useState<{
        [key: string]: MyCard;
    }>({});

    const myCards: MyCard[] = useMemo(() => {
        const cardCounts: { [key: string]: number } = {};
        return cards
            .sort((c1, c2) => {
                if (sortOrder === 'suit') {
                    return c1.suit - c2.suit;
                }
                return cardUtils.compare(c1, c2);
            })
            .map((card) => {
                const description = cardUtils.getDescription(card);
                const count = cardCounts[description] ?? 0;
                cardCounts[description] = count + 1;
                return { ...card, key: `${description}-${count}` };
            });
    }, [cards, sortOrder]);

    const changeSort = () => {
        setSortOrder((order) => {
            if (order === 'suit') {
                return 'number';
            }
            return 'suit';
        });
    };

    const selectCard = (card: MyCard) => {
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

    return (
        <div className={styles.container}>
            <div className={styles.cards_container}>
                {myCards.map((card) => {
                    const description = cardUtils.getDescription(card);
                    return (
                        <div key={card.key} className={styles.card_holder}>
                            <ButtonBase
                                style={{ width: '100%', height: '100%' }}
                                onClick={() => selectCard(card)}
                            >
                                {description}
                            </ButtonBase>
                            {selectedCards[card.key] && (
                                <div className={styles.card_overlay} />
                            )}
                        </div>
                    );
                })}
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
