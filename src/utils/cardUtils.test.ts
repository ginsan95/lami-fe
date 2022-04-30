import {
    allCardNumbers,
    allCardSuits,
    Card,
    CardNumber,
    CardSuit,
    getJokerCard,
    setShouldUniqueJoker,
} from '../models/card';
import { compare, isSameKind, isStraightFlush } from './cardUtils';

function makeDiamondCards(numbers: CardNumber[]): Card[] {
    return numbers.map((number) => ({ number, suit: CardSuit.diamond }));
}

function makeAceCards(suits: CardSuit[]): Card[] {
    return suits.map((suit) => ({ suit, number: CardNumber.ace }));
}

describe('cardUtils', () => {
    beforeEach(() => {
        setShouldUniqueJoker(false);
    });

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

    test('isStraightFlush with normal cards', () => {
        // test 4 cards
        const diamond4Cards = makeDiamondCards([
            CardNumber.five,
            CardNumber.four,
            CardNumber.three,
            CardNumber.six,
        ]);
        expect(isStraightFlush(diamond4Cards)).toStrictEqual({
            valid: true,
            cards: makeDiamondCards([
                CardNumber.three,
                CardNumber.four,
                CardNumber.five,
                CardNumber.six,
            ]),
            insertPosition: 'end',
        });

        // test 13 cards
        const diamond13Cards = makeDiamondCards(allCardNumbers);
        expect(isStraightFlush(diamond13Cards)).toStrictEqual({
            valid: true,
            cards: makeDiamondCards(allCardNumbers),
            insertPosition: 'start',
        });

        // test A to 2
        const aceTo2Cards = makeDiamondCards([
            CardNumber.ace,
            CardNumber.two,
            CardNumber.three,
        ]);
        expect(isStraightFlush(aceTo2Cards)).toStrictEqual({
            valid: true,
            cards: aceTo2Cards,
            insertPosition: 'end',
        });

        // test 2 cards
        const diamond2Cards = makeDiamondCards([
            CardNumber.five,
            CardNumber.four,
        ]);
        expect(isStraightFlush(diamond2Cards).valid).toBe(false);

        // test different suits
        const mixed4Cards = [...diamond4Cards];
        mixed4Cards[1] = { ...mixed4Cards[1], suit: CardSuit.spade };
        expect(isStraightFlush(mixed4Cards).valid).toBe(false);

        // test hole in card
        const holeInCards = [...diamond4Cards].slice(1, 4);
        expect(isStraightFlush(holeInCards).valid).toBe(false);

        // test extra same number in card
        const sameNumberInCards = [...diamond4Cards];
        sameNumberInCards.push({
            number: CardNumber.six,
            suit: CardSuit.diamond,
        });
        expect(isStraightFlush(sameNumberInCards).valid).toBe(false);

        // test 14 cards
        const diamond14Cards = makeDiamondCards([
            ...allCardNumbers,
            CardNumber.ace,
        ]);
        expect(isStraightFlush(diamond14Cards).valid).toBe(false);
    });

    test('isStraightFlush with joker cards', () => {
        // test with joker - [3, Joker, Joker, 6, Joker, 8]
        const jokerCards = makeDiamondCards([
            CardNumber.six,
            CardNumber.three,
            CardNumber.eight,
        ]);
        jokerCards.push(...[getJokerCard(), getJokerCard(), getJokerCard()]);
        const expectedJokerCards = makeDiamondCards([
            CardNumber.three,
            CardNumber.six,
            CardNumber.eight,
        ]);
        expectedJokerCards.splice(1, 0, getJokerCard());
        expectedJokerCards.splice(2, 0, getJokerCard());
        expectedJokerCards.splice(4, 0, getJokerCard());
        expect(isStraightFlush(jokerCards)).toStrictEqual({
            valid: true,
            cards: expectedJokerCards,
            insertPosition: 'end',
        });

        // test with joker for Ace at start - [A, Joker, Joker, 4, Joker, 6]
        const jokerAceTo2Cards = makeDiamondCards([
            CardNumber.four,
            CardNumber.ace,
            CardNumber.six,
        ]);
        jokerAceTo2Cards.push(
            ...[getJokerCard(), getJokerCard(), getJokerCard()]
        );
        const expectedJokerAceTo2Cards = makeDiamondCards([
            CardNumber.ace,
            CardNumber.four,
            CardNumber.six,
        ]);
        expectedJokerAceTo2Cards.splice(1, 0, getJokerCard());
        expectedJokerAceTo2Cards.splice(2, 0, getJokerCard());
        expectedJokerAceTo2Cards.splice(4, 0, getJokerCard());
        expect(isStraightFlush(jokerAceTo2Cards)).toStrictEqual({
            valid: true,
            cards: expectedJokerAceTo2Cards,
            insertPosition: 'end',
        });

        // test with extra jokers at start side - [Joker, 3, Joker, Joker, 6, Joker, 8]
        const jokerExtraStartCards = [...jokerCards, getJokerCard()];
        const expectedJokerExtraStartCards = [
            getJokerCard(),
            ...expectedJokerCards,
        ];
        expect(isStraightFlush(jokerExtraStartCards, 'start')).toStrictEqual({
            valid: true,
            cards: expectedJokerExtraStartCards,
            insertPosition: 'start',
        });

        // test with extra jokers at end side - [3, Joker, Joker, 6, Joker, 8, Joker]
        const jokerExtraEndCards = [...jokerCards, getJokerCard()];
        const expectedJokerExtraEndCards = [
            ...expectedJokerCards,
            getJokerCard(),
        ];
        expect(isStraightFlush(jokerExtraEndCards, 'end')).toStrictEqual({
            valid: true,
            cards: expectedJokerExtraEndCards,
            insertPosition: 'end',
        });

        // test will move joker to end if start no space - [A, Joker, Joker, 4, Joker, 6, Joker]
        const jokerExtraMoveToEndCards = [...jokerAceTo2Cards, getJokerCard()];
        const expectedJokerExtraMoveToEndCards = [
            ...expectedJokerAceTo2Cards,
            getJokerCard(),
        ];
        expect(
            isStraightFlush(jokerExtraMoveToEndCards, 'start')
        ).toStrictEqual({
            valid: true,
            cards: expectedJokerExtraMoveToEndCards,
            insertPosition: 'end',
        });

        // test will move joker to start if end no space - [A, Joker, Joker, 4, Joker, 6, Joker]
        const jokerExtraMoveToStartCards = makeDiamondCards([
            CardNumber.king,
            CardNumber.ace,
        ]);
        jokerExtraMoveToStartCards.push(getJokerCard());
        const expectedJokerExtraMoveToStartCards = [
            getJokerCard(),
            ...makeDiamondCards([CardNumber.king, CardNumber.ace]),
        ];
        expect(
            isStraightFlush(jokerExtraMoveToStartCards, 'end')
        ).toStrictEqual({
            valid: true,
            cards: expectedJokerExtraMoveToStartCards,
            insertPosition: 'start',
        });

        // test not enough joker - [3, Joker, Joker, 6, 8]
        const insufficientJokerCards = [...jokerCards];
        insufficientJokerCards.pop();
        expect(isStraightFlush(insufficientJokerCards).valid).toBe(false);
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

        // test with joker
        const jokerCards = [
            getJokerCard(),
            getJokerCard(),
            { suit: CardSuit.spade, number: CardNumber.four },
        ];
        expect(isSameKind(jokerCards)).toBe(true);

        // test 2 cards
        const ace2Cards = makeAceCards([CardSuit.heart, CardSuit.spade]);
        expect(isSameKind(ace2Cards)).toBe(false);

        // test different number
        const differentNumberCards = [...mixed4AceCards];
        differentNumberCards.push({
            number: CardNumber.two,
            suit: CardSuit.spade,
        });
        differentNumberCards.push(getJokerCard());
        expect(isSameKind(differentNumberCards)).toBe(false);
    });
});
