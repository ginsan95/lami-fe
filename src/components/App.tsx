import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import Routes from './Routes';

const App: React.FunctionComponent = () => {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (initialized) return;
        const firebaseConfig = {
            apiKey: 'AIzaSyChS4yqkRUzRhoVO0eiAgXe-5d5mXe5uPY',
            authDomain: 'lami-game.firebaseapp.com',
            projectId: 'lami-game',
            storageBucket: 'lami-game.appspot.com',
            messagingSenderId: '824137481818',
            appId: '1:824137481818:web:6d799578f676a9fe4be263',
            measurementId: 'G-VTLNW9P4T1',
        };
        firebase.initializeApp(firebaseConfig);
        setInitialized(true);
    }, [initialized]);

    return initialized ? <Routes /> : null;
};

export default App;
