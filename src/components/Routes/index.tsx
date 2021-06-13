import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routeURLs from './urls';
import Game from '../Game';
import GameRoom from '../Room/GameRoom';
import Lobby from '../Lobby';

const Routes: React.FunctionComponent = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Lobby />
                </Route>
                <Route path={routeURLs.GAME} exact>
                    <Game />
                </Route>
                <Route path={routeURLs.ROOM} exact>
                    <GameRoom />
                </Route>
            </Switch>
        </Router>
    );
};

export default Routes;
