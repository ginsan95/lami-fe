import { useContext } from 'react';
import { LamiGameContext } from './lamiGameContext';

export default function useLamiGame() {
    const context = useContext(LamiGameContext);
    const { game, increaseRound, selectedCards, setSelectedCards } = context;

    const { playerNum } = game;

    const resetSelection = () => {
        setSelectedCards({});
    };

    const playNewStraightFlushCards = () => {
        const valid = game.playNewStraightFlushCards({
            cards: Object.values(selectedCards),
            insertPosition: 'end',
        });
        if (valid) {
            resetSelection();
            increaseRound();
        }
    };

    const playStraightFlushCards = (params: {
        table: { tableNum: number; row: number };
        insertPosition: 'start' | 'end';
    }) => {
        const valid = game.playStraightFlushCards({
            playerNum,
            cards: Object.values(selectedCards),
            ...params,
        });
        if (valid) {
            resetSelection();
            increaseRound();
        }
    };

    const discardCards = () => {
        const valid = game.playMyDiscardCards(Object.values(selectedCards));
        if (valid) {
            resetSelection();
            increaseRound();
        }
    };

    return {
        ...context,
        playNewStraightFlushCards,
        playStraightFlushCards,
        discardCards,
    };
}