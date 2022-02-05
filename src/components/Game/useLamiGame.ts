import { useContext } from 'react';
import { LamiGameContext } from './lamiGameContext';

export default function useLamiGame() {
    const context = useContext(LamiGameContext);
    const { game, nextTurn, selectedCards, setSelectedCards } = context;

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
            nextTurn();
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
            nextTurn();
        }
    };

    const discardCards = () => {
        const valid = game.playMyDiscardCards(Object.values(selectedCards));
        if (valid) {
            resetSelection();
            nextTurn();
        }
    };

    const surrender = () => {
        game.deadPlayers.add(game.playerNum);
        nextTurn();
    };

    return {
        ...context,
        playNewStraightFlushCards,
        playStraightFlushCards,
        discardCards,
        surrender,
    };
}
