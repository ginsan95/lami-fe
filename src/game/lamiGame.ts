import Deck from './deck';
import { Card } from '../models/card';

const playerCountToCardCount = {
    3: 4 * 6, // Take 6 times
    4: 4 * 5, // Take 5 times
};

class LamiGame {
    deck: Deck;
    playerNum: number;
    playerCards: Card[][] = [];

    constructor(playerNum: number, playersCount: 3 | 4) {
        this.deck = new Deck();
        this.playerNum = playerNum;
        const numberOfCardsToTake = playerCountToCardCount[playersCount];
        for (let i = 0; i < playersCount; i++) {
            this.playerCards.push(
                this.deck.cards.slice(
                    i * numberOfCardsToTake,
                    (i + 1) * numberOfCardsToTake
                )
            );
        }
    }

    get myCards() {
        return this.playerCards[this.playerNum];
    }
}

export default LamiGame;
