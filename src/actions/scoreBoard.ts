import { Message, MessageType } from '../models/message';
import { Card } from '../models/card';

export interface CalculatePlayerScorePayload {
    playerNum: number;
    cards: Card[];
}
export function calculatePlayerScore(
    payload: CalculatePlayerScorePayload
): Message<CalculatePlayerScorePayload> {
    return {
        type: MessageType.CALCULATE_PLAYER_SCORE,
        payload,
    };
}
