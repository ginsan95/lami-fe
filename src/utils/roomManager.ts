import firebase from 'firebase';

type DocRef = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

const configs = {
    iceServers: [
        {
            urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
            ],
        },
    ],
    iceCandidatePoolSize: 10,
};

const CHANNEL_LABEL = 'roomChannel';

export class RoomManager {
    private _peerConnection?: RTCPeerConnection;
    roomID?: string = undefined;
    dataChannel?: RTCDataChannel;

    messageHandler?: (message: any) => void;

    get peerConnection(): RTCPeerConnection {
        if (!this._peerConnection) {
            console.log('Create new peer connection');
            this._peerConnection = new RTCPeerConnection(configs);
        }
        return this._peerConnection;
    }

    createRoom = async () => {
        const peerConnection = this.peerConnection;
        const db = firebase.firestore();
        const roomRef = await db.collection('rooms').doc();

        // Create a new data channel first
        const channelPromise = this.createDataChannel();

        // Collect ICE candidates
        this.collectCandidates(roomRef, 'callerCandidates', 'calleeCandidates');

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('Created offer:', offer);

        // Create new offer
        const roomWithOffer = {
            offer: {
                type: offer.type,
                sdp: offer.sdp,
            },
        };
        await roomRef.set(roomWithOffer);
        this.roomID = roomRef.id;
        console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);

        // Listen to new answer from DB and add it to peer connection
        roomRef.onSnapshot(async (snapshot) => {
            const data = snapshot.data();
            if (
                !peerConnection.currentRemoteDescription &&
                data &&
                data.answer
            ) {
                console.log('Got remote description: ', data.answer);
                const rtcSessionDescription = new RTCSessionDescription(
                    data.answer
                );
                await peerConnection.setRemoteDescription(
                    rtcSessionDescription
                );
            }
        });

        // Wait for the channel to be created
        this.dataChannel = await channelPromise;
        this.listenToMessage();
    };

    joinRoom = async (roomID: string) => {
        const peerConnection = this.peerConnection;
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomID);
        const roomSnapshot = await roomRef.get();

        if (!roomSnapshot.exists) {
            throw new Error(`Missing room with ID:${roomID} in DB`);
        }

        const offer = roomSnapshot.data()?.offer;
        if (!offer) {
            throw new Error(`Missing offer with ID:${roomID} in DB`);
        }
        console.log('Got offer:', offer);

        // Listen to data channel
        const channelPromise = this.receiveDataChannel();

        // Collect ICE candidates
        this.collectCandidates(roomRef, 'calleeCandidates', 'callerCandidates');

        // Setup offer
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
        );

        this.roomID = roomID;

        // Create new answer
        const answer = await peerConnection.createAnswer();
        console.log('Created answer:', answer);
        await peerConnection.setLocalDescription(answer);

        // Send the answer to DB for host to connect
        const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp,
            },
        };
        await roomRef.update(roomWithAnswer);

        // Wait for the channel to be created
        this.dataChannel = await channelPromise;
        this.listenToMessage();
    };

    sendMessage = (data: any) => {
        if (!this.dataChannel) return;
        const message = JSON.stringify(data);
        console.log('Send message', message);
        this.dataChannel.send(message);
    };

    private listenToMessage = () => {
        if (!this.dataChannel) return;

        this.dataChannel.onmessage = (event) => {
            const data = event.data;
            const message = JSON.parse(data);
            console.log('Receive message', message);

            if (!this.messageHandler) return;
            this.messageHandler(message);
        };
    };

    private collectCandidates = (
        roomRef: DocRef,
        localName: string,
        remoteName: string
    ) => {
        const localCandidatesCollection = roomRef.collection(localName);
        const remoteCandidatesCollection = roomRef.collection(remoteName);

        // Listen to new candidate from peer connection and add to DB
        this.peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
                console.log('Got final candidate!');
                return;
            }
            console.log('Got candidate: ', event.candidate);
            localCandidatesCollection.add(event.candidate.toJSON());
        };

        // Listen to DB changes (from other peer) and add to peer connection
        remoteCandidatesCollection.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    console.log(
                        `Got new remote ICE candidate: ${JSON.stringify(data)}`
                    );
                    await this.peerConnection.addIceCandidate(
                        new RTCIceCandidate(data)
                    );
                }
            });
        });
    };

    private createDataChannel = (): Promise<RTCDataChannel> =>
        new Promise<RTCDataChannel>((resolve, reject) => {
            const dataChannel = this.peerConnection.createDataChannel(
                CHANNEL_LABEL
            );
            console.log('create channel');

            dataChannel.onopen = () => {
                console.log('Data channel is ready');
                resolve(dataChannel);
            };

            dataChannel.onerror = (error) => {
                console.log('Failed to create data channel');
                reject(error);
            };
        });

    private receiveDataChannel = (): Promise<RTCDataChannel> =>
        new Promise<RTCDataChannel>((resolve) => {
            this.peerConnection.ondatachannel = (event) => {
                resolve(event.channel);
            };
        });
}

const roomManager = new RoomManager();

export default roomManager;
