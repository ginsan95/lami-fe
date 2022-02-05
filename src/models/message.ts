export enum MessageType {
    ERROR = 'error',

    JOIN_ROOM = 'join_room',
    JOIN_ROOM_SUCCESS = 'join_room_success',
    UPDATE_PLAYERS = 'update_players',
    START_GAME = 'start_game',

    PLAY_STRAIGHT_FLUSH_CARDS = 'play_straight_flush_card',
    PLAY_DISCARD_CARDS = 'play_discard_cards',
    SURRENDER = 'surrender',
}

export interface Message<T = any> {
    type: MessageType;
    payload: T;
}

export enum ErrorMessage {
    PLAYERS_FULL = 'Players are full',
}
