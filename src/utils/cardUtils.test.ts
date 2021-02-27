import {
    allCardNumbers,
    allCardSuits,
    Card,
    CardNumber,
    CardSuit,
} from '../models/card';
import { compare, isSameKind, isStraightFlush } from './cardUtils';

function makeDiamondCards(numbers: CardNumber[]): Card[] {
    return numbers.map((number) => ({ number, suit: CardSuit.diamond }));
}

function makeAceCards(suits: CardSuit[]): Card[] {
    return suits.map((suit) => ({ suit, number: CardNumber.ace }));
}

describe('cardUtils', () => {
    test('card comparison', () => {
        const fourOfDiamond: Card = {
            number: CardNumber.four,
            suit: CardSuit.diamond,
        };
        const fourOfHeart: Card = {
            number: CardNumber.four,
            suit: CardSuit.heart,
        };
        const jackOfHeart: Card = {
            number: CardNumber.jack,
            suit: CardSuit.heart,
        };
        const aceOfClub: Card = { number: CardNumber.ace, suit: CardSuit.club };

        expect(compare(fourOfHeart, fourOfDiamond)).toBe(2);
        expect(compare(fourOfDiamond, fourOfDiamond)).toBe(0);
        expect(compare(fourOfHeart, jackOfHeart)).toBe(-28);
        expect(compare(aceOfClub, jackOfHeart)).toBe(11);
    });

    test('isStraightFlush', () => {
        // test 4 cards
        const diamond4Cards = makeDiamondCards([
            CardNumber.five,
            CardNumber.four,
            CardNumber.three,
            CardNumber.six,
        ]);
        expect(isStraightFlush(diamond4Cards)).toBe(true);

        // test 13 cards
        const diamond13Cards = makeDiamondCards(allCardNumbers);
        expect(isStraightFlush(diamond13Cards)).toBe(true);

        // test A to 2
        const aceTo2Cards = makeDiamondCards([
            CardNumber.two,
            CardNumber.three,
            CardNumber.ace,
        ]);
        expect(isStraightFlush(aceTo2Cards)).toBe(true);

        // test 2 cards
        const diamond2Cards = makeDiamondCards([
            CardNumber.five,
            CardNumber.four,
        ]);
        expect(isStraightFlush(diamond2Cards)).toBe(false);

        // test different suits
        const mixed4Cards = [...diamond4Cards];
        mixed4Cards[1] = { ...mixed4Cards[1], suit: CardSuit.spade };
        expect(isStraightFlush(mixed4Cards)).toBe(false);

        // test hole in card
        const holeInCards = [...diamond4Cards].slice(1, 4);
        expect(isStraightFlush(holeInCards)).toBe(false);

        // test 14 cards
        const diamond14Cards = makeDiamondCards([
            ...allCardNumbers,
            CardNumber.ace,
        ]);
        expect(isStraightFlush(diamond14Cards)).toBe(false);
    });

    test('isSameKind', () => {
        // test 4 cards
        const mixed4AceCards = makeAceCards(allCardSuits);
        expect(isSameKind(mixed4AceCards)).toBe(true);

        // test with some same suits
        const someSame5AceCards = [...mixed4AceCards];
        someSame5AceCards.push({
            number: CardNumber.ace,
            suit: CardSuit.spade,
        });
        expect(isSameKind(someSame5AceCards)).toBe(true);

        // test 2 cards
        const ace2Cards = makeAceCards([CardSuit.heart, CardSuit.spade]);
        expect(isSameKind(ace2Cards)).toBe(false);

        // test different number
        const differentNumberCards = [...mixed4AceCards];
        differentNumberCards.push({
            number: CardNumber.two,
            suit: CardSuit.spade,
        });
        expect(isSameKind(differentNumberCards)).toBe(false);
    });
});
