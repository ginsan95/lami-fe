import {
    allCardNumbers,
    allCardSuits,
    Card,
    CardNumber,
    CardSuit,
} from '../models/card';

const minCardCombo = 3;

export function compare(card1: Card, card2: Card): number {
    const card1InDeck = (card1.number - 1) * allCardSuits.length + card1.suit;
    const card2InDeck = (card2.number - 1) * allCardSuits.length + card2.suit;
    return card1InDeck - card2InDeck;
}

const aceToTwoComparisonValue = compare(
    { number: CardNumber.ace, suit: CardSuit.diamond },
    { number: CardNumber.two, suit: CardSuit.diamond }
);

export function isStraightFlush(cards: Card[]): boolean {
    if (cards.length < minCardCombo || cards.length > allCardNumbers.length) {
        return false;
    }
    const sortedCards = [...cards].sort((c1, c2) => compare(c1, c2));
    const firstCard = sortedCards[0];
    for (let i = 1; i < sortedCards.length; i++) {
        const card1 = sortedCards[i - 1];
        const card2 = sortedCards[i];
        // Ace will always be the last and 2 will always be the first if available
        // So add extra checking and allow such combination to happen
        if (
            compare(card1, card2) !== -allCardSuits.length &&
            compare(firstCard, card2) !== -aceToTwoComparisonValue
        ) {
            return false;
        }
    }
    return true;
}

export function isSameKind(cards: Card[]): boolean {
    if (cards.length < minCardCombo) {
        return false;
    }
    for (let i = 1; i < cards.length; i++) {
        const card1 = cards[i - 1];
        const card2 = cards[i];
        if (card1.number !== card2.number) {
            return false;
        }
    }
    return true;
}
