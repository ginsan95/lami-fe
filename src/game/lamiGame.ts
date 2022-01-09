import { Card, CardNumber, CardSuit } from '../models/card';
import * as cardUtils from '../utils/cardUtils';

class LamiGame {
    playerNum: number;
    playerCards: Card[][] = [];

    straightFlushCards: Card[][][] = [];
    discardedCards: { [K in CardNumber]?: Card[] } = {};

    deadPlayers: Set<number> = new Set();

    constructor(playerNum: number, myCards: Card[], playersCount: 3 | 4 = 4) {
        this.playerNum = playerNum;
        this.playerCards[playerNum] = myCards;
        for (let i = 0; i < playersCount; i++) {
            this.straightFlushCards.push([]);
        }
    }

    handCards = (playerNum: number): Card[] => {
        return this.playerCards[playerNum];
    };

    get myHandCards(): Card[] {
        return this.handCards(this.playerNum);
    }

    private reducePlayerCards = (playerNum: number, cards: Card[]) => {
        if (playerNum >= this.playerCards.length) return;
        let currentIndex = 0;
        const newCards = [...this.playerCards[playerNum]];
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
        this.playerCards[playerNum] = newCards;
    };

    playNewStraightFlushCards = (params: {
        cards: Card[];
        insertPosition: 'start' | 'end';
    }): boolean => {
        const { cards, insertPosition } = params;
        const tableRow = this.straightFlushCards[this.playerNum].length;
        return this.playStraightFlushCards({
            playerNum: this.playerNum,
            cards,
            table: { tableNum: this.playerNum, row: tableRow },
            insertPosition,
        });
    };

    playStraightFlushCards = (params: {
        playerNum: number;
        cards: Card[];
        table: { tableNum: number; row: number };
        insertPosition: 'start' | 'end';
    }): boolean => {
        const { playerNum, cards, table, insertPosition } = params;
        const { tableNum, row } = table;

        if (tableNum >= this.straightFlushCards.length) return false;

        const currentCards: Card[] =
            this.straightFlushCards[tableNum][row] ?? [];
        const combinedCards = [...currentCards, ...cards];

        const { valid, cards: newCards } = cardUtils.isStraightFlush(
            combinedCards,
            insertPosition
        );

        if (!valid) return false;

        this.straightFlushCards[tableNum][row] = newCards;
        this.reducePlayerCards(playerNum, cards);
        return true;
    };

    playMyDiscardCards = (cards: Card[]): boolean => {
        return this.playDiscardCards({
            playerNum: this.playerNum,
            cards,
        });
    };

    playDiscardCards = (params: {
        playerNum: number;
        cards: Card[];
    }): boolean => {
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

        return true;
    };
}

export default LamiGame;
