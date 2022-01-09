import {
    allCardNumbers,
    allCardSuits,
    Card,
    getJokerCard,
} from '../models/card';

const playerCountToCardCount = {
    3: 4 * 6, // Take 6 times
    4: 4 * 5, // Take 5 times
};

class Deck {
    cards: Card[];

    constructor() {
        const myCards: Card[] = [];
        for (let suit of allCardSuits) {
            for (let num of allCardNumbers) {
                myCards.push({ suit, number: num });
            }
        }
        // There are 4 joker in 1 set of cards
        for (let i = 0; i < 4; i++) {
            myCards.push(getJokerCard());
        }

        this.cards = [...myCards, ...myCards];
        this.shuffle();
    }

    shuffle = () => {
        const cardLength = this.cards.length;
        for (let i = 0; i < cardLength; i++) {
            const randIndex = Math.floor(Math.random() * 100) + 1;
            const temp = this.cards[i];
            this.cards[i] = this.cards[randIndex];
            this.cards[randIndex] = temp;
        }
    };

    getCards = (playerNum: number, playersCount: 3 | 4 = 4): Card[] => {
        const numberOfCardsToTake = playerCountToCardCount[playersCount];
        return this.cards.slice(
            playerNum * numberOfCardsToTake,
            (playerNum + 1) * numberOfCardsToTake
        );
    };
}

export default Deck;
