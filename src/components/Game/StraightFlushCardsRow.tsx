import React, { useEffect, useRef, useState } from 'react';
import { allCardNumbers, Card, CardNumber, CardSuit } from '../../models/card';
import CardComponent from './CardComponent';
import styles from './StraightFlushCards.module.sass';
import LamiGame from '../../game/lamiGame';
import usePrevious from '../../hooks/usePrevious';
import * as cardUtils from '../../utils/cardUtils';

interface StraightFlushCardsRowProps {
    game: LamiGame;
    cards: Card[];
    row: number;
    onClick: (row: number, insertPosition: 'start' | 'end') => void;
}

// This will mutate the current array and return the deleted joker count.
function removeStartAndEndJokers(
    cards: Card[]
): { startJokers: number; endJokers: number } {
    if (cards.length === 0) return { startJokers: 0, endJokers: 0 };
    let startJokers = 0;
    let endJokers = 0;
    // Remove start.
    while (cards.length > 0 && cards[0].suit === CardSuit.joker) {
        cards.splice(0, 1);
        startJokers++;
    }
    // Remove end.
    while (
        cards.length > 0 &&
        cards[cards.length - 1].suit === CardSuit.joker
    ) {
        cards.splice(-1, 1);
        endJokers++;
    }
    return { startJokers, endJokers };
}

const StraightFlushCardsRow: React.FunctionComponent<StraightFlushCardsRowProps> = (
    props
) => {
    const { game, cards, row, onClick: handleClick } = props;

    const [newCardRange, setNewCardRange] = useState<{
        start: number;
        end: number;
    }>();

    const playerNumTurn = game.playerNumTurn;
    const prevPlayerNumTurn = usePrevious(playerNumTurn);

    const prevCards = useRef<Card[]>([]);

    useEffect(() => {
        // Ensure is a different player playing.
        if (playerNumTurn === prevPlayerNumTurn) return;
        // Get a copy and update prevCards.
        const myPrevCards = prevCards.current;
        prevCards.current = [...cards];

        const newCardsCount = cards.length - myPrevCards.length;
        if (newCardsCount > 0) {
            const myCards = [...cards];
            const jokerCounts = removeStartAndEndJokers(myCards);
            const prevJokerCounts = removeStartAndEndJokers(myPrevCards);

            if (jokerCounts.startJokers > prevJokerCounts.startJokers) {
                // More jokers at start, so it's append at start.
                setNewCardRange({ start: 0, end: newCardsCount });
            } else if (jokerCounts.endJokers > prevJokerCounts.endJokers) {
                // More jokers at end, so it's append at end.
                setNewCardRange({
                    start: cards.length - newCardsCount,
                    end: cards.length,
                });
            } else if (
                myPrevCards.length > 0 &&
                cardUtils.compare(myCards[0], myPrevCards[0]) !== 0
            ) {
                // First card is different, so it's append at start.
                setNewCardRange({ start: 0, end: newCardsCount });
            } else {
                // Definitely append at end then.
                setNewCardRange({
                    start: cards.length - newCardsCount,
                    end: cards.length,
                });
            }
        } else {
            setNewCardRange(undefined);
        }
    }, [playerNumTurn, prevPlayerNumTurn, cards]);

    return (
        <div className={styles.cards_container}>
            {cards.map((card, index) => {
                const clickable =
                    cards.length < allCardNumbers.length &&
                    card.number !== CardNumber.ace &&
                    (index === 0 || index === cards.length - 1) &&
                    game.allowedToPlay &&
                    !game.isMyStraightFlushEmpty;
                const onClick = () => {
                    if (clickable) {
                        handleClick(row, index === 0 ? 'start' : 'end');
                    }
                };
                const isNewCard =
                    newCardRange !== undefined &&
                    index >= newCardRange.start &&
                    index < newCardRange.end;

                return (
                    <CardComponent
                        key={card.number}
                        card={card}
                        height={50}
                        width={30}
                        clickable={clickable}
                        onClick={onClick}
                        selected={isNewCard}
                    />
                );
            })}
        </div>
    );
};

export default StraightFlushCardsRow;
