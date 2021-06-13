import { ErrorMessage, Message, MessageType } from '../models/message';
import { Player } from '../models/player';

export function joinRoom(player: Player): Message {
    return {
        type: MessageType.JOIN_ROOM,
        payload: player,
    };
}

export function joinRoomSuccess(
    name: string,
    newName: string | undefined
): Message {
    return {
        type: MessageType.JOIN_ROOM_SUCCESS,
        payload: {
            name,
            newName,
        },
    };
}

export function updatePlayers(players: Player[]): Message {
    return {
        type: MessageType.UPDATE_PLAYERS,
        payload: players,
    };
}

export function sendError(message: ErrorMessage): Message {
    return {
        type: MessageType.ERROR,
        payload: new Error(message),
    };
}
