import { Card } from '../models/card';
import { useMemo } from 'react';
import * as cardUtils from '../utils/cardUtils';

export interface KeyedCard extends Card {
    key: string;
}

export default function useKeyedCards(
    cards: Card[],
    sort?: (c1: Card, c2: Card) => number
): KeyedCard[] {
    return useMemo(() => {
        const cardCounts: { [key: string]: number } = {};
        return cards
            .map((card) => {
                const description = cardUtils.getDescription(card);
                const count = cardCounts[description] ?? 0;
                cardCounts[description] = count + 1;
                return { ...card, key: `${description}-${count}` };
            })
            .sort(sort);
    }, [cards, sort]);
}
