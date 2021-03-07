import {
    allCardNumbers,
    allCardSuits,
    Card,
    CardNumber,
    CardSuit,
    getJokerCard,
} from '../models/card';

const minCardCombo = 3;

export function getDescription(card: Card): string {
    return `${card.number}-${card.suit}`;
}

export function compare(card1: Card, card2: Card): number {
    const card1InDeck = (card1.number - 1) * allCardSuits.length + card1.suit;
    const card2InDeck = (card2.number - 1) * allCardSuits.length + card2.suit;
    return card1InDeck - card2InDeck;
}

const aceToTwoComparisonValue = compare(
    { number: CardNumber.ace, suit: CardSuit.diamond },
    { number: CardNumber.two, suit: CardSuit.diamond }
);

export function isStraightFlush(
    cards: Card[],
    insertPosition: 'start' | 'end' = 'end'
): { valid: boolean; cards: Card[] } {
    if (cards.length < minCardCombo || cards.length > allCardNumbers.length) {
        return { valid: false, cards: [] };
    }

    const myCards = cards
        .filter((card) => card.suit !== CardSuit.joker)
        .sort((c1, c2) => compare(c1, c2));

    let moveAceToFront = false;
    let jokerCount = cards.length - myCards.length;
    // This indicate which index we should insert joker into
    const jokerInsertIndexes: number[] = [];

    const firstCard = myCards[0];
    const checkAndHandleJokers = (
        jokerNeededCount: number,
        offset: number = 0
    ) => {
        if (
            Number.isInteger(jokerNeededCount) &&
            jokerNeededCount > 0 &&
            jokerNeededCount <= jokerCount
        ) {
            jokerCount -= jokerNeededCount;
            for (let j = 0; j < jokerNeededCount; j++) {
                jokerInsertIndexes.push(j + offset);
            }
            return true;
        }
        return false;
    };

    for (let i = 1; i < myCards.length; i++) {
        const card1 = myCards[i - 1];
        const card2 = myCards[i];

        let diff = compare(card2, card1);
        if (diff === allCardSuits.length) {
            continue;
        }

        let jokerNeededCount = diff / allCardSuits.length - 1;
        const offset = i + jokerInsertIndexes.length;
        let isValid = checkAndHandleJokers(jokerNeededCount, offset);
        if (isValid) {
            continue;
        }

        if (card2.number !== CardNumber.ace || i !== myCards.length - 1) {
            return { valid: false, cards: [] };
        }

        diff = compare(card2, firstCard);
        if (diff === aceToTwoComparisonValue) {
            moveAceToFront = true;
            continue;
        }

        jokerNeededCount =
            (aceToTwoComparisonValue - diff) / allCardSuits.length;
        isValid = checkAndHandleJokers(jokerNeededCount);
        if (isValid) {
            moveAceToFront = true;
            continue;
        }

        return { valid: false, cards: [] };
    }

    const newCards = [...myCards];
    for (let index of jokerInsertIndexes) {
        newCards.splice(index, 0, getJokerCard());
    }

    if (moveAceToFront) {
        const aceCard = newCards.pop()!;
        newCards.splice(0, 0, aceCard);
    }

    let myInsertPosition = insertPosition;
    if (moveAceToFront && myInsertPosition === 'start') {
        myInsertPosition = 'end';
    } else if (
        newCards[newCards.length - 1].number === CardNumber.ace &&
        myInsertPosition === 'end'
    ) {
        myInsertPosition = 'start';
    }

    for (let i = 0; i < jokerCount; i++) {
        if (myInsertPosition === 'start') {
            newCards.splice(0, 0, getJokerCard());
        } else if (myInsertPosition === 'end') {
            newCards.push(getJokerCard());
        }
    }

    return { valid: true, cards: newCards };
}

export function isSameKind(cards: Card[]): boolean {
    if (cards.length < minCardCombo) {
        return false;
    }
    for (let i = 1; i < cards.length; i++) {
        const card1 = cards[i - 1];
        const card2 = cards[i];
        // If any of them are joker, we consider it as valid
        if (
            card1.number !== card2.number &&
            card1.suit !== CardSuit.joker &&
            card2.suit !== CardSuit.joker
        ) {
            return false;
        }
    }
    return true;
}
