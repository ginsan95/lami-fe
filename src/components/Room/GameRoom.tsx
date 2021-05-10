import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import roomManager from '../../utils/roomManager';

interface RouteParams {
    roomID: string;
}

const GameRoom: React.FunctionComponent = () => {
    const { roomID } = useParams<RouteParams>();

    const isHost = roomID === 'host';

    useEffect(() => {
        const action = async () => {
            if (isHost) {
                await roomManager.createRoom();
            } else {
                await roomManager.joinRoom(roomID);
                roomManager.sendMessage({ type: 'join_room' });
            }
        };
        action().catch((error) => console.error(error));
    }, [isHost, roomID]);

    return <div>{roomID}</div>;
};

export default GameRoom;
