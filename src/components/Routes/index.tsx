import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routeURLs from './urls';
import Lobby from '../Lobby';
import GameRoute from './GameRoute';

const Routes: React.FunctionComponent = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Lobby />
                </Route>
                <Route path={[routeURLs.GAME, routeURLs.ROOM]}>
                    <GameRoute />
                </Route>
            </Switch>
        </Router>
    );
};

export default Routes;
