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
): { valid: boolean; cards: Card[]; insertPosition: 'start' | 'end' } {
    if (cards.length < minCardCombo || cards.length > allCardNumbers.length) {
        return { valid: false, cards: [], insertPosition };
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
            return { valid: false, cards: [], insertPosition };
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

        return { valid: false, cards: [], insertPosition };
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

    addJokersToCards(newCards, jokerCount, myInsertPosition);

    return { valid: true, cards: newCards, insertPosition: myInsertPosition };
}

function addJokersToCards(
    cards: Card[],
    jokerCount: number,
    insertPosition: 'start' | 'end'
) {
    for (let i = 0; i < jokerCount; i++) {
        if (insertPosition === 'start') {
            cards.splice(0, 0, getJokerCard());
        } else if (insertPosition === 'end') {
            cards.push(getJokerCard());
        }
    }
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

export function readjustJokersIfNeeded(
    cards: Card[],
    prevCards: Card[],
    insertPosition: 'start' | 'end'
): Card[] {
    if (cards.length === prevCards.length) return cards; // No changes

    const myCards = [...cards];
    const myPrevCards = [...prevCards];
    const jokerCounts = removeStartAndEndJokers(myCards);
    const prevJokerCounts = removeStartAndEndJokers(myPrevCards);
    let totalJokerCount = jokerCounts.startJokers + jokerCounts.endJokers;

    if (
        prevJokerCounts.startJokers > 0 &&
        compare(myCards[0], myPrevCards[0]) === 0
    ) {
        addJokersToCards(myCards, prevJokerCounts.startJokers, 'start');
        totalJokerCount -= prevJokerCounts.startJokers;
    }
    if (
        prevJokerCounts.endJokers > 0 &&
        compare(
            myCards[myCards.length - 1],
            myPrevCards[myPrevCards.length - 1]
        ) === 0
    ) {
        addJokersToCards(myCards, prevJokerCounts.endJokers, 'end');
        totalJokerCount -= prevJokerCounts.endJokers;
    }
    if (totalJokerCount > 0) {
        addJokersToCards(myCards, totalJokerCount, insertPosition);
    }

    return myCards;
}

// This will mutate the current array and return the deleted joker count.
export function removeStartAndEndJokers(
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

export function calculateScore(cards: Card[]): number {
    return cards.reduce((total, card) => {
        let score = card.number;
        if (card.suit === CardSuit.joker) {
            score = 0;
        } else if (card.number === CardNumber.ace) {
            score = 15; // Ace is calculate as 15.
        } else if (
            card.number === CardNumber.jack ||
            card.number === CardNumber.queen ||
            card.number === CardNumber.king
        ) {
            score = 10; // Pictures are all 10.
        }
        return total + score;
    }, 0);
}
