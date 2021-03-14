import React from 'react';
import styles from './GameBoard.module.sass';
import StraightFlushCards from './StraightFlushCards';
import { allCardNumbers, Card, CardSuit } from '../../models/card';

const playedCards: Card[][] = [
    allCardNumbers.map((number) => ({
        number,
        suit: CardSuit.spade,
    })),
    allCardNumbers.map((number) => ({
        number,
        suit: CardSuit.heart,
    })),
];

const verticalWidth = 50 * 3 + 8 * 2;
const horizontalHeight = 50 * 2 + 8;

const GameBoard: React.FunctionComponent = (props) => {
    return (
        <div className={styles.container}>
            <StraightFlushCards
                playedCards={playedCards}
                height="100%"
                width={verticalWidth}
                position="left"
            />
            <div className={styles.center_area}>
                <StraightFlushCards
                    playedCards={playedCards}
                    height={horizontalHeight}
                    width="100%"
                    position="top"
                />
                <div className={styles.discard_area} />
                <StraightFlushCards
                    playedCards={playedCards}
                    height={horizontalHeight}
                    width="100%"
                    position="bottom"
                />
            </div>
            <StraightFlushCards
                playedCards={playedCards}
                height="100%"
                width={verticalWidth}
                position="right"
            />
        </div>
    );
};

export default GameBoard;
