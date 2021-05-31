import Peer, { DataConnection } from 'peerjs';
import MessageHandler from './messageHandler';

class RoomManager2 {
    private _peer: Peer | undefined;
    private roomID: string | undefined;

    private connections: DataConnection[] = [];

    messageHandler?: MessageHandler;

    get peer(): Peer {
        if (!this._peer) {
            this._peer = new Peer();
        }
        return this._peer;
    }

    createRoom = async (): Promise<string> => {
        const id = await this.initializePeer();

        this.peer.on('connection', (connection) => {
            this.connections.push(connection);
            this.listenToMessage(connection);
            console.log('New connection', connection);
        });

        return id;
    };

    joinRoom = async (roomID: string): Promise<void> => {
        await this.initializePeer();
        return new Promise((resolve) => {
            const connection = this.peer.connect(roomID);
            this.connections.push(connection);
            this.listenToMessage(connection);
            connection.on('open', () => {
                resolve();
            });
        });
    };

    sendMessage = (message: any) => {
        this.connections.forEach((connection) => {
            connection.send(message);
        });
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

const roomManager = new RoomManager2();

export default roomManager;
