import React from 'react';
import { ButtonBase } from '@material-ui/core';
import * as cssUtils from '../../utils/cssUtils';
import { Card, CardNumber, CardSuit } from '../../models/card';
import styles from './CardComponent.module.sass';

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

function getCardName(card: Card): string {
    if (card.suit === CardSuit.joker) {
        return 'JOK';
    }
    let emoji = String(card.suit);
    switch (card.suit) {
        case CardSuit.spade: {
            emoji = '♠️';
            break;
        }
        case CardSuit.heart: {
            emoji = '♥️';
            break;
        }
        case CardSuit.club: {
            emoji = '♣️';
            break;
        }
        case CardSuit.diamond: {
            emoji = '♦️';
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
    return letter + emoji;
}

function getColor(suit: CardSuit): string {
    switch (suit) {
        case CardSuit.spade:
            return 'black';
        case CardSuit.heart:
            return 'crimson';
        case CardSuit.club:
            return 'purple';
        case CardSuit.diamond:
            return 'cadetblue';
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
            className={cssUtils.joinClassNames(styles.card_holder, className)}
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
                {cardName}
            </ButtonBase>
            {selected && (
                <div
                    style={{ height: '100%', width: '100%' }}
                    className={styles.card_overlay}
                />
            )}
        </div>
    );
};

export default CardComponent;
