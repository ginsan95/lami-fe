import Peer, { DataConnection } from 'peerjs';
import MessageHandler from './messageHandler';
import { getSessionStorage } from './storageUtils';

class RoomManager {
    private _peer: Peer | undefined;
    private roomID: string | undefined;

    private connections: { [key: string]: DataConnection } = {};

    messageHandler?: MessageHandler;

    private get peer(): Peer {
        if (!this._peer) {
            let hostIp: string | null = getSessionStorage('hostIp');
            if (hostIp != null) {
                this._peer = new Peer({host: hostIp, port: 9000});
            } else {
                this._peer = new Peer();
            }
        }
        return this._peer;
    }

    getId = (): string => {
        return this.peer.id;
    }

    createRoom = async (): Promise<string> => {
        const id = await this.initializePeer();

        this.peer.on('connection', (connection) => {
            this.connections[connection.peer] = connection;
            this.listenToMessage(connection);
            console.log('New connection', connection);
        });

        return id;
    };

    joinRoom = async (roomID: string): Promise<void> => {
        // I got no idea why you need this.
        await this.initializePeer();
        return new Promise((resolve, reject) => {
            const connection = this.peer.connect(roomID);
            this.connections[connection.peer] = connection;
            this.listenToMessage(connection);
            connection.on('open', () => {
                resolve();
            });
            connection.on('error', (error) => {
                console.error('Connection error', error);
                reject(error);
            });
        });
    };

    sendMessage = (message: any, peerID?: string) => {
        console.log('send', message, peerID);
        if (peerID) {
            // Send to specific peer if available
            this.connections[peerID]?.send(message);
        } else {
            // Else send to everyone
            for (let myPeerID in this.connections) {
                this.connections[myPeerID].send(message);
            }
        }
    };

    private initializePeer = async (): Promise<string> => {
        const peer = this.peer;
        return new Promise((resolve, reject) => {
            peer.on('open', (id) => {
                this.roomID = id;
                console.log('roomID', id);
                resolve(id);
            });

            this.peer.on('error', (error) => {
                console.error('Peer error', error);
                reject(error);
            });
        });
    };

    private listenToMessage = (connection: DataConnection) => {
        connection.on('data', (message) => {
            console.log('receive', message);
            if (!this.messageHandler) return;
            this.messageHandler.handleMessage(message);
        });
    };
}

const roomManager = new RoomManager();

export default roomManager;