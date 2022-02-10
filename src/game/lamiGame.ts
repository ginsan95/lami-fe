import { Card, CardNumber, CardSuit } from '../models/card';
import * as cardUtils from '../utils/cardUtils';

export interface PlayStraightFlushCardsPayload {
    playerNum: number;
    cards: Card[];
    table: { tableNum: number; row: number };
    insertPosition: 'start' | 'end';
}

export interface PlayDiscardCardsPayload {
    playerNum: number;
    cards: Card[];
}

class LamiGame {
    playerNum: number;
    handCards: Card[] = [];
    playersCount: number;

    straightFlushCards: Card[][][] = [];
    discardedCards: { [K in CardNumber]?: Card[] } = {};

    playersCardCount: number[] = [];
    deadPlayers: Set<number> = new Set();
    playerNumTurn: number;

    get allowedToPlay(): boolean {
        return (
            this.playerNumTurn === this.playerNum &&
            !this.deadPlayers.has(this.playerNum)
        );
    }

    get isMyStraightFlushEmpty(): boolean {
        return this.straightFlushCards[this.playerNum].length === 0;
    }

    get isGameFinished(): boolean {
        // Game is finished when all players surrendered or 1 player finished all cards.
        return (
            this.deadPlayers.size === this.playersCount ||
            this.playersCardCount.includes(0)
        );
    }

    constructor(
        playerNum: number,
        handCards: Card[],
        startingPlayerNum: number = 0,
        playersCount: 3 | 4 = 4
    ) {
        this.playerNum = playerNum;
        this.handCards = handCards;
        this.playersCount = playersCount;
        this.playerNumTurn = startingPlayerNum;
        for (let i = 0; i < playersCount; i++) {
            this.straightFlushCards.push([]);
            this.playersCardCount.push(handCards.length);
        }
    }

    private reducePlayerCards = (playerNum: number, cards: Card[]) => {
        // We can only reduce own cards.
        if (playerNum !== this.playerNum) return;
        let currentIndex = 0;
        const newCards = [...this.handCards];
        while (currentIndex < cards.length) {
            const currentCard = cards[currentIndex];
            for (let i = 0; i < newCards.length; i++) {
                if (
                    newCards[i].number === currentCard.number &&
                    newCards[i].suit === currentCard.suit
                ) {
                    newCards.splice(i, 1);
                    break;
                }
            }
            currentIndex++;
        }
        this.handCards = newCards;
    };

    reducePlayerCardsCount = (playerNum: number, cardsLength: number) => {
        this.playersCardCount[playerNum] =
            this.playersCardCount[playerNum] - cardsLength;
    };

    newStraightFlushCardsPayload = (params: {
        cards: Card[];
        insertPosition: 'start' | 'end';
    }): PlayStraightFlushCardsPayload => {
        const { cards, insertPosition } = params;
        const tableRow = this.straightFlushCards[this.playerNum].length;
        return {
            playerNum: this.playerNum,
            cards,
            table: { tableNum: this.playerNum, row: tableRow },
            insertPosition,
        };
    };

    playStraightFlushCards = (
        params: PlayStraightFlushCardsPayload
    ): boolean => {
        const { playerNum, cards, table, insertPosition } = params;
        const { tableNum, row } = table;

        if (tableNum >= this.straightFlushCards.length) return false;
        if (cards.length === 0) return false;

        const currentCards: Card[] =
            this.straightFlushCards[tableNum][row] ?? [];
        const combinedCards = [...currentCards, ...cards];

        const result = cardUtils.isStraightFlush(combinedCards, insertPosition);

        if (!result.valid) return false;

        const newCards = cardUtils.readjustJokersIfNeeded(
            result.cards,
            currentCards,
            insertPosition
        );
        this.straightFlushCards[tableNum][row] = newCards;
        this.reducePlayerCards(playerNum, cards);
        this.reducePlayerCardsCount(playerNum, cards.length);

        return true;
    };

    playDiscardCards = (params: PlayDiscardCardsPayload): boolean => {
        const { playerNum, cards } = params;
        if (cards.length === 0) return false;

        // Find the first card with no joker
        const myCard = cards.find((card) => card.suit !== CardSuit.joker);
        const firstNumber: CardNumber = Number(
            Object.keys(this.discardedCards)[0]
        );
        const firstCards = this.discardedCards[firstNumber] ?? [];
        // If all the cards are joker, we will randomly place it in any of the existing discarded cards.
        // If discard pile is empty, we just select Ace.
        // This scenario can only happen if user discard joker into an empty discard pile.
        const key: CardNumber =
            myCard?.number ?? firstCards[0].number ?? CardNumber.ace;

        const currentCards = this.discardedCards[key] ?? [];
        const combinedCards = [...currentCards, ...cards];
        const valid = cardUtils.isSameKind(combinedCards);

        if (!valid) return false;

        // Replace with new value
        this.discardedCards[key] = combinedCards;
        this.reducePlayerCards(playerNum, cards);
        this.reducePlayerCardsCount(playerNum, cards.length);

        return true;
    };

    surrender = (playerNum: number) => {
        this.deadPlayers.add(playerNum);
    };

    nextTurn = () => {
        // All players are dead, no need to change turn.
        if (this.deadPlayers.size >= this.playersCount) {
            return;
        }
        let newTurn = this.playerNumTurn;
        do {
            newTurn = (newTurn + 1) % this.playersCount;
        } while (this.deadPlayers.has(newTurn));
        this.playerNumTurn = newTurn;
    };

    getTableNumber = (
        position: 'top' | 'left' | 'right' | 'bottom'
    ): number => {
        switch (position) {
            case 'top':
                return (this.playerNum + 2) % this.playersCount;
            case 'left':
                return (this.playerNum + 3) % this.playersCount;
            case 'right':
                return (this.playerNum + 1) % this.playersCount;
            case 'bottom':
                return this.playerNum;
            default:
                return this.playerNum;
        }
    };
}

export default LamiGame;
