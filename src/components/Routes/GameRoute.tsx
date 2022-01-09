import React from 'react';
import { GameRoomProvider } from '../Room/gameRoomContext';
import { Route, Switch } from 'react-router-dom';
import routeURLs from './urls';
import Game from '../Game';
import GameRoom from '../Room/GameRoom';

const GameRoute: React.FunctionComponent = () => {
    return (
        <GameRoomProvider>
            <Switch>
                <Route path={routeURLs.GAME} exact>
                    <Game />
                </Route>
                <Route path={routeURLs.ROOM} exact>
                    <GameRoom />
                </Route>
            </Switch>
        </GameRoomProvider>
    );
};

export default GameRoute;
