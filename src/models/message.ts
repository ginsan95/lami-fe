export enum MessageType {
    ERROR = 'error',

    JOIN_ROOM = 'join_room',
    JOIN_ROOM_SUCCESS = 'join_room_success',
    UPDATE_PLAYERS = 'update_players',
}

export interface Message {
    type: MessageType;
    payload: any;
}

export enum ErrorMessage {
    PLAYERS_FULL = 'Players are full',
}
