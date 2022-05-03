import React, { useCallback, useEffect, useRef, useState } from 'react';
import LamiGame from '../../game/lamiGame';
import { KeyedCard } from '../../hooks/useKeyedCards';
import MessageHandler, { IMessageHandler } from '../../utils/messageHandler';
import roomManager from '../../utils/roomManager';
import { MessageType } from '../../models/message';
import * as gameActions from '../../actions/game';
import { useHistory } from 'react-router-dom';
import routeURLs from '../Routes/urls';

type SelectedCards = {
    [key: string]: KeyedCard;
};

export interface ILamiGameContext {
    game: LamiGame;
    round: number;
    nextTurn: () => void;
    endGameIfPossible: () => void;
    selectedCards: SelectedCards;
    setSelectedCards: React.Dispatch<React.SetStateAction<SelectedCards>>;
    isDiscardCollapsed: boolean;
    setIsDiscardCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LamiGameContext = React.createContext<ILamiGameContext>({
    game: new LamiGame(0, []),
    round: 1,
    nextTurn: () => {},
    endGameIfPossible: () => {},
    selectedCards: {},
    setSelectedCards: () => {},
    isDiscardCollapsed: false,
    setIsDiscardCollapsed: () => {},
});

interface LamiGameProviderProps {
    game: LamiGame;
    playerNum: number;
    isHost: boolean;
}

export const LamiGameProvider: React.FunctionComponent<LamiGameProviderProps> = ({
    children,
    game,
    playerNum,
    isHost,
}) => {
    const [round, setRound] = useState(1);
    const [selectedCards, setSelectedCards] = useState({});
    const [isDiscardCollapsed, setIsDiscardCollapsed] = useState(false);

    const history = useHistory();

    const nextTurn = useCallback(() => {
        // Change the player turn.
        game.nextTurn();
        // Increase the round to regenerate the UI.
        setRound((round) => round + 1);
    }, [game]);

    const endGameIfPossible = useCallback(() => {
        if (!game.isGameFinished) return;
        // Transition to score board screen
        history.push(routeURLs.SCORE_BOARD, {
            playerNum: game.playerNum,
            cards: game.handCards,
            isHost,
        });
    }, [game, history, isHost]);

    const messageHandler = useRef<IMessageHandler>(new MessageHandler());

    // Setup message handler
    useEffect(() => {
        roomManager.messageHandler = messageHandler.current as MessageHandler;
        return () => (roomManager.messageHandler = undefined);
    }, []);

    // Common message handler. Host and client share the same.
    useEffect(() => {
        const handler = messageHandler.current;

        handler.on(MessageType.PLAY_STRAIGHT_FLUSH_CARDS, (payload) => {
            if (payload.playerNum === playerNum) return;
            // Play this cards in my game instant.
            game.playStraightFlushCards(payload);
            nextTurn();
            endGameIfPossible();
            // Inform other players about this for host.
            if (isHost) {
                roomManager.sendMessage(
                    gameActions.playStraightFlushCards(payload)
                );
            }
        });

        handler.on(MessageType.PLAY_DISCARD_CARDS, (payload) => {
            if (payload.playerNum === playerNum) return;
            // Play this cards in my game instant.
            game.playDiscardCards(payload);
            nextTurn();
            endGameIfPossible();
            // Inform other players about this for host.
            if (isHost) {
                roomManager.sendMessage(gameActions.playDiscardCards(payload));
            }
        });

        handler.on(MessageType.SURRENDER, (surrenderPlayerNum) => {
            if (surrenderPlayerNum === playerNum) return;
            // Surrender in my game instant.
            game.surrender(surrenderPlayerNum);
            nextTurn();
            endGameIfPossible();
            // Inform other players about this for host.
            if (isHost) {
                roomManager.sendMessage(
                    gameActions.surrender(surrenderPlayerNum)
                );
            }
        });
    }, [isHost, playerNum, game, nextTurn, endGameIfPossible]);

    return (
        <LamiGameContext.Provider
            value={{
                game,
                round,
                nextTurn,
                endGameIfPossible,
                selectedCards,
                setSelectedCards,
                isDiscardCollapsed,
                setIsDiscardCollapsed,
            }}
        >
            {children}
        </LamiGameContext.Provider>
    );
};
