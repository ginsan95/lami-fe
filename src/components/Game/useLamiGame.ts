import { useContext } from 'react';
import { LamiGameContext } from './lamiGameContext';
import roomManager from '../../utils/roomManager2';
import * as gameActions from '../../actions/game';

export default function useLamiGame() {
    const context = useContext(LamiGameContext);
    const {
        game,
        nextTurn,
        endGameIfPossible,
        selectedCards,
        setSelectedCards,
    } = context;

    const { playerNum } = game;

    const resetSelection = () => {
        setSelectedCards({});
    };

    const playNewStraightFlushCards = (
        insertPosition: 'start' | 'end'
    ) => () => {
        const payload = game.newStraightFlushCardsPayload({
            cards: Object.values(selectedCards),
            insertPosition,
        });
        const valid = game.playStraightFlushCards(payload);
        if (valid) {
            resetSelection();
            nextTurn();
            roomManager.sendMessage(
                gameActions.playStraightFlushCards(payload)
            );
            endGameIfPossible();
        }
    };

    const playStraightFlushCards = (params: {
        table: { tableNum: number; row: number };
        insertPosition: 'start' | 'end';
    }) => {
        const payload = {
            playerNum,
            cards: Object.values(selectedCards),
            ...params,
        };
        const valid = game.playStraightFlushCards(payload);
        if (valid) {
            resetSelection();
            nextTurn();
            roomManager.sendMessage(
                gameActions.playStraightFlushCards(payload)
            );
            endGameIfPossible();
        }
    };

    const discardCards = () => {
        const payload = {
            playerNum: game.playerNum,
            cards: Object.values(selectedCards),
        };
        const valid = game.playDiscardCards(payload);
        if (valid) {
            resetSelection();
            nextTurn();
            roomManager.sendMessage(gameActions.playDiscardCards(payload));
            endGameIfPossible();
        }
    };

    const surrender = () => {
        game.surrender(game.playerNum);
        nextTurn();
        roomManager.sendMessage(gameActions.surrender(game.playerNum));
        endGameIfPossible();
    };

    return {
        ...context,
        playNewStraightFlushCards,
        playStraightFlushCards,
        discardCards,
        surrender,
    };
}
