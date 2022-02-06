import { enumToArray } from '../utils/objectUtils';

export enum CardSuit {
    diamond = 1,
    club,
    heart,
    spade,
    joker,
}

export const allCardSuits = enumToArray<CardSuit>(CardSuit).slice(
    0,
    CardSuit.spade
);

export enum CardNumber {
    two = 2,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    ten,
    jack,
    queen,
    king,
    ace,
}

export const allCardNumbers = enumToArray<CardNumber>(CardNumber);

export interface Card {
    suit: CardSuit;
    number: CardNumber;
}

let currentJokerNumber = CardNumber.two;

export function getJokerCard(): Card {
    const card = {
        number: currentJokerNumber,
        suit: CardSuit.joker,
    };
    currentJokerNumber += 1; // Ensure joker always unique
    return card;
}
