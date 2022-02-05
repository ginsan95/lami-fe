import { Message, MessageType } from '../models/message';
import {
    PlayDiscardCardsPayload,
    PlayStraightFlushCardsPayload,
} from '../game/lamiGame';

export function playStraightFlushCards(
    payload: PlayStraightFlushCardsPayload
): Message<PlayStraightFlushCardsPayload> {
    return {
        type: MessageType.PLAY_STRAIGHT_FLUSH_CARDS,
        payload,
    };
}

export function playDiscardCards(
    payload: PlayDiscardCardsPayload
): Message<PlayDiscardCardsPayload> {
    return {
        type: MessageType.PLAY_DISCARD_CARDS,
        payload,
    };
}

export function surrender(playerNum: number): Message<number> {
    return {
        type: MessageType.SURRENDER,
        payload: playerNum,
    };
}
