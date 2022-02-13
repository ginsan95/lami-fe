import { Player } from '../models/player';
import { Message, MessageType } from '../models/message';
import { JoinRoomSuccessPayload, StartGamePayload } from '../actions/gameRoom';
import {
    PlayDiscardCardsPayload,
    PlayStraightFlushCardsPayload,
} from '../game/lamiGame';
import { CalculatePlayerScorePayload } from '../actions/scoreBoard';

export interface IMessageHandler {
    on(type: MessageType.JOIN_ROOM, handler: (player: Player) => void): void;
    on(
        type: MessageType.JOIN_ROOM_SUCCESS,
        handler: (payload: JoinRoomSuccessPayload) => void
    ): void;
    on(
        type: MessageType.UPDATE_PLAYERS,
        handler: (players: Player[]) => void
    ): void;
    on(
        type: MessageType.START_GAME,
        handler: (payload: StartGamePayload) => void
    ): void;

    on(
        type: MessageType.PLAY_STRAIGHT_FLUSH_CARDS,
        handler: (payload: PlayStraightFlushCardsPayload) => void
    ): void;
    on(
        type: MessageType.PLAY_DISCARD_CARDS,
        handler: (payload: PlayDiscardCardsPayload) => void
    ): void;
    on(type: MessageType.SURRENDER, handler: (playerNum: number) => void): void;

    on(
        type: MessageType.CALCULATE_PLAYER_SCORE,
        handler: (payload: CalculatePlayerScorePayload) => void
    ): void;
    on(type: MessageType.SCORE_BOARD_HOST_READY, handler: () => void): void;

    on(type: MessageType.ERROR, handler: (error: Error) => void): void;
}

class MessageHandler implements IMessageHandler {
    private allHandlers: { [key in MessageType]?: (payload: any) => void } = {};

    handleMessage = (message: Message) => {
        const myHandler = this.allHandlers[message.type];
        if (myHandler) {
            myHandler(message.payload);
        }
    };

    on = (type: MessageType, handler: (payload: any) => void) => {
        this.allHandlers[type] = handler;
    };
}

export default MessageHandler;
