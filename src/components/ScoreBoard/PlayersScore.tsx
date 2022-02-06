import React, { useMemo } from 'react';
import { Card } from '../../models/card';
import { Player } from '../../models/player';
import * as cardUtils from '../../utils/cardUtils';
import CardComponent from '../Game/CardComponent';
import useKeyedCards from '../../hooks/useKeyedCards';
import styles from './ScoreBoard.module.sass';

interface PlayersScoreProps {
    allCards: (Card[] | undefined)[];
    players: Player[];
}

const PlayersScore: React.FunctionComponent<PlayersScoreProps> = (props) => {
    const { allCards, players } = props;

    const sortedItems = useMemo(
        () =>
            players
                .map((player, index) => ({
                    ...player,
                    cards: allCards[index],
                    score: allCards[index]
                        ? cardUtils.calculateScore(allCards[index] || [])
                        : undefined,
                }))
                .sort(
                    (item1, item2) =>
                        (item1.score ?? Number.MAX_SAFE_INTEGER) -
                        (item2.score ?? Number.MAX_SAFE_INTEGER)
                ),
        [players, allCards]
    );

    return (
        <>
            {sortedItems.map((item) => (
                <PlayersScoreItem
                    key={item.name}
                    name={item.name}
                    cards={item.cards}
                    score={item.score}
                />
            ))}
        </>
    );
};

interface PlayersScoreItemProps {
    name: String;
    cards?: Card[];
    score?: number;
}

const PlayersScoreItem: React.FunctionComponent<PlayersScoreItemProps> = (
    props
) => {
    const { name, cards, score } = props;
    const scoreText = score !== undefined ? String(score) : 'pending';
    const title = `${name} (${scoreText})`;

    const keyedCards = useKeyedCards(cards ?? [], cardUtils.compare);

    return (
        <div>
            <p>{title}</p>
            <div className={styles.cards_container}>
                {cards &&
                    keyedCards.map((card, index) => (
                        <CardComponent
                            key={card.key}
                            card={card}
                            height={56}
                            width={37}
                            style={{
                                marginRight:
                                    index < keyedCards.length - 1 ? 4 : 0,
                            }}
                        />
                    ))}
            </div>
        </div>
    );
};

export default PlayersScore;
