import { Player } from '../models/player';
import { Message, MessageType } from '../models/message';
import { JoinRoomSuccessPayload, StartGamePayload } from '../actions/gameRoom';

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
