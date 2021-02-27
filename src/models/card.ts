import { enumToArray } from '../utils/objectUtils';

export enum CardSuit {
    diamond = 1,
    club,
    heart,
    spade,
}

export const allCardSuits = enumToArray<CardSuit>(CardSuit);

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
