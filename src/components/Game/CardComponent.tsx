import React from 'react';
import { ButtonBase } from '@mui/material';
import * as cssUtils from '../../utils/cssUtils';
import { Card, CardNumber, CardSuit } from '../../models/card';
import styles from './CardComponent.module.sass';
import {
    JokerIcon,
    SpadeIcon,
    DiamondIcon,
    HeartIcon,
    ClubIcon,
} from './CardIcons';

interface CardComponentProps {
    card: Card;
    height: number;
    width: number;
    className?: string;
    style?: React.CSSProperties;
    clickable?: boolean;
    selected?: boolean;
    onClick?: () => void;
}

function getCardName(card: Card): {
    letter: string;
    emoji: React.ReactNode;
} {
    if (card.suit === CardSuit.joker) {
        return {
            letter: 'JOK',
            emoji: <JokerIcon />,
        };
    }
    let emoji = null;
    switch (card.suit) {
        case CardSuit.spade: {
            emoji = <SpadeIcon />;
            break;
        }
        case CardSuit.heart: {
            emoji = <HeartIcon />;
            break;
        }
        case CardSuit.club: {
            emoji = <ClubIcon />;
            break;
        }
        case CardSuit.diamond: {
            emoji = <DiamondIcon />;
            break;
        }
    }
    let letter = String(card.number);
    switch (card.number) {
        case CardNumber.ace: {
            letter = 'A';
            break;
        }
        case CardNumber.jack: {
            letter = 'J';
            break;
        }
        case CardNumber.queen: {
            letter = 'Q';
            break;
        }
        case CardNumber.king: {
            letter = 'K';
            break;
        }
    }
    return {
        letter,
        emoji,
    };
}

function getColor(suit: CardSuit): string {
    switch (suit) {
        case CardSuit.spade:
            return 'black';
        case CardSuit.heart:
            return 'red';
        case CardSuit.club:
            return 'black';
        case CardSuit.diamond:
            return 'red';
        case CardSuit.joker:
            return 'brown';
        default:
            return '';
    }
}

const CardComponent: React.FunctionComponent<CardComponentProps> = (props) => {
    const {
        card,
        height,
        width,
        className,
        style,
        clickable = false,
        selected,
        onClick,
    } = props;

    const cardName = getCardName(card);
    // minus 2 for the border
    const actualHeight = height - 2;
    const actualWidth = width - 2;

    return (
        <div
            style={{
                height: actualHeight,
                width: actualWidth,
                backgroundColor: 'white',
                ...style,
            }}
            className={cssUtils.joinClassNames(
                styles.card_holder,
                selected ? styles.card_holder_selected : '',
                className
            )}
        >
            <ButtonBase
                style={{
                    width: '100%',
                    height: '100%',
                    fontSize: 'larger',
                    wordBreak: 'break-all',
                    color: getColor(card.suit),
                }}
                onClick={onClick}
                disabled={!clickable}
            >
                {cardName.letter === 'JOK' ? (
                    <div className={styles.card_joker}>{cardName.emoji}</div>
                ) : (
                    <>
                        <div className={styles.card_number}>
                            <span>{cardName.emoji}</span>
                            <span>{cardName.letter}</span>
                        </div>
                        <div className={styles.card_suit}>{cardName.emoji}</div>
                        <div
                            className={cssUtils.joinClassNames(
                                styles.card_number,
                                styles.card_number_bottom
                            )}
                        >
                            <span>{cardName.emoji}</span>
                            <span>{cardName.letter}</span>
                        </div>
                    </>
                )}
            </ButtonBase>
        </div>
    );
};

export default CardComponent;
