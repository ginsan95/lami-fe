import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Card } from '../../models/card';
import styles from './DiscardedCards.module.sass';
import CardComponent from './CardComponent';
import useKeyedCards from '../../hooks/useKeyedCards';
import useLamiGame from './useLamiGame';
import PlayersName from './PlayersName';
import usePrevious from '../../hooks/usePrevious';

const DiscardedCards: React.FunctionComponent = () => {
    const { game } = useLamiGame();
    const playedCards = Object.values(game.discardedCards);

    const sortedCards = useMemo(
        () =>
            playedCards.sort(
                (c1, c2) => (c1 ? c1[0].number : 0) - (c2 ? c2[0].number : 0)
            ),
        [playedCards]
    );

    return (
        <div className={styles.container}>
            <PlayersName playersCount={game.playersCount} />
            {sortedCards.map((cards, index) => (
                <MyCards
                    key={cards ? cards[0].number : index}
                    cards={cards ?? []}
                    playerNumTurn={game.playerNumTurn}
                />
            ))}
        </div>
    );
};

interface MyCardsProps {
    cards: Card[];
    playerNumTurn: number;
}

const MyCards: React.FunctionComponent<MyCardsProps> = (props) => {
    const { cards, playerNumTurn } = props;
    const [isNewCardsAdded, setIsNewCardsAdded] = useState(false);

    const sortCards = useCallback(
        (c1: Card, c2: Card) => c1.suit - c2.suit,
        []
    );
    const keyedCards = useKeyedCards(cards, sortCards);

    const cardsCount = cards.length;
    const prevCardsCount = useRef(0);

    const prevPlayerNumTurn = usePrevious(playerNumTurn);

    useEffect(() => {
        // Ensure is a different player playing.
        if (playerNumTurn === prevPlayerNumTurn) return;
        setIsNewCardsAdded(cardsCount > prevCardsCount.current);
        prevCardsCount.current = cardsCount;
    }, [prevPlayerNumTurn, playerNumTurn, cardsCount]);

    return (
        <div className={styles.cards_container}>
            {keyedCards.map((card) => (
                <CardComponent
                    key={card.key}
                    card={card}
                    height={50}
                    width={30}
                    selected={isNewCardsAdded}
                />
            ))}
        </div>
    );
};

export default DiscardedCards;
