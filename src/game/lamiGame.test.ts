import LamiGame from './lamiGame';
import {
    allCardNumbers,
    Card,
    CardNumber,
    CardSuit,
    getJokerCard,
    setShouldUniqueJoker,
} from '../models/card';

function makeCards(numbers: CardNumber[], suit: CardSuit): Card[] {
    return numbers.map((number) => ({ number, suit }));
}

function getSampleHardCards(): Card[] {
    return [
        ...makeCards(allCardNumbers, CardSuit.diamond),
        ...makeCards(
            [
                CardNumber.six,
                CardNumber.seven,
                CardNumber.eight,
                CardNumber.nine,
            ],
            CardSuit.heart
        ),
        getJokerCard(),
        getJokerCard(),
        getJokerCard(),
    ];
}

function getSampleHandCardsForDiscard(): Card[] {
    return [
        ...getSampleHardCards().slice(3, 20),
        ...makeCards(
            [CardNumber.seven, CardNumber.seven, CardNumber.seven],
            CardSuit.club
        ),
    ];
}

describe('lamiGame', () => {
    beforeEach(() => {
        setShouldUniqueJoker(false);
    });

    test('create new lami game', () => {
        const game = new LamiGame(0, [], 0, 4);
        expect(game.playersCardCount.length).toBe(4);
        expect(game.straightFlushCards.length).toBe(4);
    });

    test('play new straight flush on empty table', () => {
        const playerNum = 0;
        const game = new LamiGame(playerNum, getSampleHardCards(), 0, 4);
        expect(game.straightFlushCards[playerNum]).toStrictEqual([]);

        const cards = makeCards(
            [CardNumber.three, CardNumber.four, CardNumber.five],
            CardSuit.diamond
        );
        const valid = game.playStraightFlushCards({
            playerNum,
            cards,
            insertPosition: 'start',
            table: { tableNum: playerNum, row: 0 },
        });

        expect(valid).toBe(true);
        expect(game.straightFlushCards[playerNum]).toStrictEqual([cards]);
        expect(game.handCards.length).toBe(17);
    });

    test('play new straight flush on another player table', () => {
        const playerNum = 0;
        const tableNum = 2;
        const row = 1;
        const game = new LamiGame(playerNum, getSampleHardCards(), 0, 4);
        const currentCards = [
            getJokerCard(),
            ...makeCards(
                [CardNumber.four, CardNumber.five, CardNumber.six],
                CardSuit.heart
            ),
            getJokerCard(),
        ];
        game.straightFlushCards[tableNum] = [
            makeCards(
                [CardNumber.five, CardNumber.six, CardNumber.seven],
                CardSuit.spade
            ),
            currentCards,
        ];
        expect(game.straightFlushCards[tableNum][row]).toStrictEqual(
            currentCards
        );

        const cards = [
            ...makeCards([CardNumber.eight, CardNumber.nine], CardSuit.heart),
            getJokerCard(),
        ];
        const valid = game.playStraightFlushCards({
            playerNum,
            cards,
            insertPosition: 'end',
            table: { tableNum, row },
        });

        expect(valid).toBe(true);
        expect(game.straightFlushCards[tableNum][row]).toStrictEqual([
            ...currentCards,
            ...cards,
        ]);
        expect(game.handCards.length).toBe(17);
    });

    test('play invalid straight flush', () => {
        const playerNum = 0;
        const game = new LamiGame(playerNum, getSampleHardCards(), 0, 4);
        const currentCards = makeCards(
            [CardNumber.five, CardNumber.six, CardNumber.seven],
            CardSuit.heart
        );
        game.straightFlushCards[playerNum] = [currentCards];
        expect(game.straightFlushCards[playerNum]).toStrictEqual([
            currentCards,
        ]);

        const cards = makeCards([CardNumber.nine], CardSuit.heart);
        const valid = game.playStraightFlushCards({
            playerNum,
            cards,
            insertPosition: 'end',
            table: { tableNum: playerNum, row: 0 },
        });

        expect(valid).toBe(false);
        expect(game.straightFlushCards[playerNum]).toStrictEqual([
            currentCards,
        ]);
        expect(game.handCards.length).toBe(20);
    });

    test('play invalid straight flush joker in middle', () => {
        const playerNum = 0;
        const game = new LamiGame(playerNum, getSampleHardCards(), 0, 4);
        const currentCards = [
            { number: CardNumber.five, suit: CardSuit.diamond },
            getJokerCard(),
            { number: CardNumber.seven, suit: CardSuit.diamond },
        ];
        game.straightFlushCards[playerNum] = [currentCards];
        expect(game.straightFlushCards[playerNum]).toStrictEqual([
            currentCards,
        ]);

        const cards = [{ number: CardNumber.six, suit: CardSuit.diamond }];
        const valid = game.playStraightFlushCards({
            playerNum,
            cards,
            insertPosition: 'start',
            table: { tableNum: playerNum, row: 0 },
        });

        expect(valid).toBe(false);
        expect(game.straightFlushCards[playerNum]).toStrictEqual([
            currentCards,
        ]);
        expect(game.handCards.length).toBe(20);
    });

    test('play invalid straight flush joker in start', () => {
        const playerNum = 0;
        const game = new LamiGame(playerNum, getSampleHardCards(), 0, 4);
        const currentCards = [
            getJokerCard(),
            ...makeCards(
                [CardNumber.five, CardNumber.six, CardNumber.seven],
                CardSuit.diamond
            ),
        ];
        game.straightFlushCards[playerNum] = [currentCards];
        expect(game.straightFlushCards[playerNum]).toStrictEqual([
            currentCards,
        ]);

        const cards = [{ number: CardNumber.two, suit: CardSuit.diamond }];
        const valid = game.playStraightFlushCards({
            playerNum,
            cards,
            insertPosition: 'start',
            table: { tableNum: playerNum, row: 0 },
        });

        expect(valid).toBe(false);
        expect(game.straightFlushCards[playerNum]).toStrictEqual([
            currentCards,
        ]);
        expect(game.handCards.length).toBe(20);
    });

    test('discard new cards', () => {
        const playerNum = 0;
        const game = new LamiGame(
            playerNum,
            getSampleHandCardsForDiscard(),
            0,
            4
        );
        expect(game.discardedCards).toStrictEqual({});

        const cards = makeCards(
            [CardNumber.seven, CardNumber.seven, CardNumber.seven],
            CardSuit.club
        );
        const valid = game.playDiscardCards({
            playerNum,
            cards,
        });

        expect(valid).toBe(true);
        expect(game.discardedCards).toStrictEqual({
            [CardNumber.seven]: cards,
        });
        expect(game.handCards.length).toBe(17);
    });

    test('discard new cards with joker', () => {
        const playerNum = 0;
        const game = new LamiGame(
            playerNum,
            getSampleHandCardsForDiscard(),
            0,
            4
        );
        expect(game.discardedCards).toStrictEqual({});

        const cards = [
            getJokerCard(),
            getJokerCard(),
            { suit: CardSuit.club, number: CardNumber.seven },
        ];
        const valid = game.playDiscardCards({
            playerNum,
            cards,
        });

        expect(valid).toBe(true);
        expect(game.discardedCards).toStrictEqual({
            [CardNumber.seven]: cards,
        });
        expect(game.handCards.length).toBe(17);
    });

    test('discard existing cards', () => {
        const playerNum = 0;
        const game = new LamiGame(
            playerNum,
            getSampleHandCardsForDiscard(),
            0,
            4
        );
        const existingCards = [
            ...makeCards([CardNumber.seven, CardNumber.seven], CardSuit.heart),
            getJokerCard(),
        ];
        game.discardedCards = {
            [CardNumber.seven]: existingCards,
        };

        const cards = [{ suit: CardSuit.club, number: CardNumber.seven }];
        const valid = game.playDiscardCards({
            playerNum,
            cards,
        });

        expect(valid).toBe(true);
        expect(game.discardedCards).toStrictEqual({
            [CardNumber.seven]: [...existingCards, ...cards],
        });
        expect(game.handCards.length).toBe(19);
    });

    test('discard only joker', () => {
        const playerNum = 0;
        const game = new LamiGame(
            playerNum,
            getSampleHandCardsForDiscard(),
            0,
            4
        );
        const existingCards = [
            ...makeCards(
                [CardNumber.seven, CardNumber.seven, CardNumber.seven],
                CardSuit.heart
            ),
            getJokerCard(),
        ];
        game.discardedCards = {
            [CardNumber.seven]: existingCards,
        };

        const cards = [getJokerCard()];
        const valid = game.playDiscardCards({
            playerNum,
            cards,
        });

        expect(valid).toBe(true);
        expect(game.discardedCards).toStrictEqual({
            [CardNumber.seven]: [...existingCards, ...cards],
        });
        expect(game.handCards.length).toBe(19);
    });

    test('discard insufficient cards not in discard pile', () => {
        const playerNum = 0;
        const game = new LamiGame(
            playerNum,
            getSampleHandCardsForDiscard(),
            0,
            4
        );
        const existingCards = [
            ...makeCards([CardNumber.seven, CardNumber.seven], CardSuit.heart),
            getJokerCard(),
        ];
        game.discardedCards = {
            [CardNumber.seven]: existingCards,
        };

        const cards = [{ suit: CardSuit.heart, number: CardNumber.eight }];
        const valid = game.playDiscardCards({
            playerNum,
            cards,
        });

        expect(valid).toBe(false);
        expect(game.discardedCards).toStrictEqual({
            [CardNumber.seven]: existingCards,
        });
        expect(game.handCards.length).toBe(20);
    });

    test('discard invalid cards', () => {
        const playerNum = 0;
        const game = new LamiGame(
            playerNum,
            getSampleHandCardsForDiscard(),
            0,
            4
        );
        const existingCards = [
            ...makeCards([CardNumber.seven, CardNumber.seven], CardSuit.heart),
            getJokerCard(),
        ];
        game.discardedCards = {
            [CardNumber.seven]: existingCards,
        };

        const cards = [
            { suit: CardSuit.heart, number: CardNumber.eight },
            { suit: CardSuit.club, number: CardNumber.seven },
        ];
        const valid = game.playDiscardCards({
            playerNum,
            cards,
        });

        expect(valid).toBe(false);
        expect(game.discardedCards).toStrictEqual({
            [CardNumber.seven]: existingCards,
        });
        expect(game.handCards.length).toBe(20);
    });
});
