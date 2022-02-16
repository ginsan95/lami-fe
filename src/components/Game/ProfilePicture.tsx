import React from 'react';
import styles from './ProfilePicture.module.sass';

interface ProfilePictureProps {
    playerName: string;
}

const getBackgroundColor = (value: string) => {
    function getHash() {
        let hash = 0;
        if (value.length == 0) return hash;
        for (let i = 0; i < value.length; i++) {
            hash = value.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        return hash;
    }

    function toHSL() {
        let shortCode = getHash() % 360;
        return `hsl(${shortCode}, 100%, 40%)`;
    }

    return toHSL();
};

const ProfilePicture: React.FunctionComponent<ProfilePictureProps> = ({
    playerName,
}) => {
    const backgroundColor = getBackgroundColor(playerName);
    const avatar = `url(https://avatars.dicebear.com/api/micah/${encodeURI(
        playerName
    )}.svg)`;

    return (
        <div
            className={styles.player_avatar}
            style={{
                backgroundColor: backgroundColor,
                backgroundImage: avatar,
            }}
        />
    );
};

export default ProfilePicture;
