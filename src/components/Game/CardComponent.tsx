import React from 'react';
import { ButtonBase } from '@material-ui/core';
import * as cardUtils from '../../utils/cardUtils';
import * as cssUtils from '../../utils/cssUtils';
import { Card } from '../../models/card';
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

    const description = cardUtils.getDescription(card);
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
                    color: cardUtils.getColor(card.suit),
                }}
                onClick={onClick}
                disabled={!clickable}
            >
                {description}
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
