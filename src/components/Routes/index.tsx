import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routeURLs from './urls';
import Game from '../Game';
import GameRoom from '../Room/GameRoom';

const Routes: React.FunctionComponent = () => {
    return (
        <Router>
            <Switch>
                <Route path={routeURLs.GAME}>
                    <Game />
                </Route>
                <Route path={routeURLs.ROOM}>
                    <GameRoom />
                </Route>
            </Switch>
        </Router>
    );
};

export default Routes;
