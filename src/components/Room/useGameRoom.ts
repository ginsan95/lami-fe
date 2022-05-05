import { useContext } from 'react';
import { GameRoomContext } from './gameRoomContext';
import Deck from '../../game/deck';
import * as gameRoomActions from '../../actions/gameRoom';
import roomManager from '../../utils/roomManager';
import routeURLs from '../Routes/urls';
import { useHistory } from 'react-router-dom';

export default function useGameRoom(winnerPlayerNum?: number) {
    const context = useContext(GameRoomContext);
    const { players } = context;

    const history = useHistory();

    const startGame = () => {
        // Create new deck.
        const deck = new Deck();
        const playersCount: 3 | 4 = players.length as any;

        let startingPlayerNum = 0;
        if (winnerPlayerNum !== undefined) {
            startingPlayerNum = (winnerPlayerNum + 1) % playersCount;
        }

        players.forEach((player, index) => {
            // Ignore for host
            if (player.isHost) return;
            const cards = deck.getCards(index, playersCount);
            const message = gameRoomActions.startGame({
                player,
                playerNum: index,
                cards,
                startingPlayerNum,
            });
            // Inform all players to start the game with their cards
            roomManager.sendMessage(message, player.peerID);
        });

        // Transition to game screen
        history.push(routeURLs.GAME, {
            playerNum: 0,
            cards: deck.getCards(0, playersCount),
            isHost: true,
            startingPlayerNum,
            playersCount,
        });
    };

    return { ...context, startGame };
}
