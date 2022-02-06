import { ErrorMessage, Message, MessageType } from '../models/message';
import { Player } from '../models/player';
import { Card } from '../models/card';

export function joinRoom(player: Player): Message<Player> {
    return {
        type: MessageType.JOIN_ROOM,
        payload: player,
    };
}

export interface JoinRoomSuccessPayload {
    name: string;
    newName?: string;
}
export function joinRoomSuccess(
    payload: JoinRoomSuccessPayload
): Message<JoinRoomSuccessPayload> {
    return {
        type: MessageType.JOIN_ROOM_SUCCESS,
        payload,
    };
}

export function updatePlayers(players: Player[]): Message<Player[]> {
    return {
        type: MessageType.UPDATE_PLAYERS,
        payload: players,
    };
}

export interface StartGamePayload {
    player: Player;
    playerNum: number;
    cards: Card[];
    startingPlayerNum: number;
}
export function startGame(
    payload: StartGamePayload
): Message<StartGamePayload> {
    return {
        type: MessageType.START_GAME,
        payload,
    };
}

export function sendError(message: ErrorMessage): Message<Error> {
    return {
        type: MessageType.ERROR,
        payload: new Error(message),
    };
}
