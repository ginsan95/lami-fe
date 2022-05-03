import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Divider, Paper, TextField } from '@mui/material';
import styles from './Lobby.module.sass';
import { getLocalStorage, saveLocalStorage, saveSessionStorage } from '../../utils/storageUtils';
import { getRandomName } from '../../constants/names';
import routeURLs from '../Routes/urls';

const Lobby: React.FunctionComponent = () => {
    const defaultName = getLocalStorage('name') ?? getRandomName();

    const history = useHistory();

    const [name, setName] = useState(defaultName);
    const [roomID, setRoomID] = useState('');

    const [isServerDefault, setisServerDefault] = useState(true);
    const [serverIp, setServerIp] = useState('');

    const isNameError = name.trim().length === 0;
    
    const validateServerIp = () => {
        let regex: RegExp = RegExp("localhost|([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})");
        let returnMsg: string | null = null;

        if (serverIp.trim().length === 0) {
            returnMsg = "Server IP cannot be empty";
        } else if (regex.exec(serverIp) == null) {
            returnMsg = "Not a valid IP Address";
        }

        return returnMsg;
    }

    const handleSettingServerIP = (str: string) => {
        setServerIp(str);
        saveSessionStorage('hostIp', str);
    }

    const isRoomIDError = roomID.trim().length === 0;

    const handleStartGame = (isHost: boolean) => {
        const myRoomID = isHost ? 'host' : roomID;
        const path = routeURLs.ROOM.replace(':roomID', myRoomID);
        saveLocalStorage('name', name);
        history.push(path, { name });
    };

    return (
        <div className={styles.container}>
            <Paper elevation={2} className={styles.content_container}>
                <h1>Lami Game</h1>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <h2>Server</h2>
                <Button
                    variant={isServerDefault ? "contained" : "outlined"}
                    style={{borderRadius: '4px 0px 0px 4px'}}
                    onClick={() => setisServerDefault(true)}
                >
                    Default
                </Button>
                <Button
                    variant={isServerDefault ? "outlined" : "contained"}
                    style={{borderRadius: '0px 4px 4px 0px'}}
                    onClick={() => setisServerDefault(false)}
                >
                    Custom
                </Button>
                {!isServerDefault ? <TextField
                    required
                    id="standard-required"
                    label="Server IP"
                    value={serverIp}
                    onChange={(e) => handleSettingServerIP(e.target.value)}
                    style={{marginTop: 20}}
                    fullWidth
                    error={validateServerIp() != null}
                    helperText={validateServerIp()}
                /> : null}
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <TextField
                    required
                    id="standard-required"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    error={isNameError}
                    helperText={isNameError && 'Name cannot be empty'}
                />
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isNameError}
                    onClick={() => handleStartGame(true)}
                >
                    Host
                </Button>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <div className={styles.join_container}>
                    <TextField
                        label="Room ID"
                        value={roomID}
                        onChange={(e) => setRoomID(e.target.value)}
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isNameError || isRoomIDError}
                        onClick={() => handleStartGame(false)}
                    >
                        Join Room
                    </Button>
                </div>
            </Paper>
        </div>
    );
};

export default Lobby;
