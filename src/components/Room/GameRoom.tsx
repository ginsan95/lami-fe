import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';

import roomManager from '../../utils/roomManager2';
import { Player } from '../../models/player';
import styles from './GameRoom.module.sass';
import MessageHandler, { IMessageHandler } from '../../utils/messageHandler';
import { ErrorMessage, MessageType } from '../../models/message';
import * as gameRoomActions from '../../actions/gameRoom';
import { getRandomName } from '../../constants/names';
import routeURLs from '../Routes/urls';
import useGameRoom from './useGameRoom';
import { getLocalStorage } from '../../utils/storageUtils';
import { joinClassNames } from '../../utils/cssUtils';

interface RouteParams {
    roomID: string;
}

interface RouteState {
    name?: string;
}

const GameRoom: React.FunctionComponent = () => {
    const { roomID } = useParams<RouteParams>();
    const stateName = useLocation<RouteState>().state?.name;
    const history = useHistory();
    const isHost = roomID === 'host';

    const messageHandler = useRef<IMessageHandler>(new MessageHandler());

    const [actualRoomID, setActualRoomID] = useState<string | undefined>();
    const [error, setError] = useState<Error | undefined>();

    const [myName, setMyName] = useState<string>(
        stateName ?? getLocalStorage('name') ?? getRandomName()
    );

    const { players, setPlayers, startGame } = useGameRoom();
    const playersCount = players.length;

    // Setup initial player for host
    useEffect(() => {
        if (isHost) {
            setPlayers([{ name: myName, isHost, peerID: roomManager.peer.id }]);
        }
    }, [isHost, setPlayers, myName]);

    // Setup message handler
    useEffect(() => {
        roomManager.messageHandler = messageHandler.current as MessageHandler;
        return () => (roomManager.messageHandler = undefined);
    }, []);

    // Host message handler
    useEffect(() => {
        if (!isHost) return;

        const handler = messageHandler.current;

        handler.on(MessageType.JOIN_ROOM, (player) => {
            if (players.length < 4) {
                // Inform joiner the success and update name if needed
                const nameExist = players.some(
                    ({ name }) => player.name === name
                );
                const newName = nameExist
                    ? getRandomName(players.map((value) => value.name))
                    : undefined;
                const message = gameRoomActions.joinRoomSuccess({
                    name: player.name,
                    newName,
                });
                roomManager.sendMessage(message, player.peerID);

                // Update players
                const newPlayer: Player = {
                    name: newName ?? player.name,
                    peerID: player.peerID,
                    isHost: false,
                };
                setPlayers((currentPlayers) => [...currentPlayers, newPlayer]);
            } else {
                // Return error if already max player
                roomManager.sendMessage(
                    gameRoomActions.sendError(ErrorMessage.PLAYERS_FULL)
                );
            }
        });
    }, [isHost, players, setPlayers]);

    // Client message handler
    useEffect(() => {
        if (isHost) return;

        const handler = messageHandler.current;

        handler.on(MessageType.JOIN_ROOM_SUCCESS, (payload) => {
            if (myName !== payload.name) return;

            setActualRoomID(roomID);
            if (payload.newName) {
                setMyName(payload.newName);
            }
        });

        handler.on(MessageType.UPDATE_PLAYERS, (players) => {
            setPlayers(players);
        });

        handler.on(MessageType.START_GAME, (payload) => {
            const { player, playerNum, cards, startingPlayerNum } = payload;
            if (player.name !== myName) return;

            // Transition to game screen
            history.push(routeURLs.GAME, {
                playerNum,
                cards,
                isHost,
                startingPlayerNum,
                playersCount,
            });
        });
    }, [isHost, myName, roomID, history, setPlayers, playersCount]);

    // Error message handler
    useEffect(() => {
        const handler = messageHandler.current;

        handler.on(MessageType.ERROR, (error) => {
            switch (error.message) {
                case ErrorMessage.PLAYERS_FULL: {
                    setError(error);
                }
            }
            console.error(error);
        });
    });

    // Host update new player list to everyone
    useEffect(() => {
        if (!isHost) return;

        roomManager.sendMessage(gameRoomActions.updatePlayers(players));
    }, [players, isHost]);

    // Perform connection
    useEffect(() => {
        const action = async () => {
            // Skip if already performed connection
            if (actualRoomID) return;
            try {
                if (isHost) {
                    const newRoomID = await roomManager.createRoom();
                    setActualRoomID(newRoomID);
                } else {
                    await roomManager.joinRoom(roomID);
                    const message = gameRoomActions.joinRoom({
                        name: myName,
                        isHost,
                        peerID: roomManager.peer.id,
                    });
                    roomManager.sendMessage(message);
                }
            } catch (error) {
                setError(error);
            }
        };
        action().catch((error) => console.error(error));
    }, [isHost, roomID, myName, actualRoomID]);

    const copyRoomURL = () => {
        const path = routeURLs.ROOM.replace(':roomID', actualRoomID || '');
        const url = window.location.origin + path;
        navigator.clipboard.writeText(url);
    };

    const renderTitleContent = () => {
        if (actualRoomID) {
            return (
                <>
                    <span>Room: {actualRoomID}</span>
                    <Button onClick={copyRoomURL}>Copy</Button>
                </>
            );
        }
        if (error) {
            return `Failed to connect: ${error.message}`;
        }
        return (
            <>
                <span>Connecting</span>
                <CircularProgress size={20} />
            </>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.title}>{renderTitleContent()}</div>
                <div className={styles.list_container}>
                    {players.map((player) => (
                        <div
                            key={player.name}
                            className={styles.list_container_item}
                        >
                            <div
                                className={styles.player_avatar}
                                style={{
                                    backgroundImage: `url(https://avatars.dicebear.com/api/micah/${window.encodeURIComponent(
                                        player.name
                                    )}.svg)`,
                                }}
                            />
                            <div
                                className={joinClassNames(
                                    styles.player_name,
                                    player.name === myName
                                        ? styles.player_name_self
                                        : ''
                                )}
                            >
                                {player.name}
                                {player.isHost ? ' (Host)' : ''}
                            </div>
                        </div>
                    ))}
                </div>

                {isHost && (
                    <div className={styles.action_wrapper}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={players.length < 3}
                            onClick={startGame}
                        >
                            Start Game
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameRoom;
