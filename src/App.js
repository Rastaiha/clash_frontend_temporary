import React from 'react';
import Login from './Login.js';
import Game from './Game.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
          <Route>
            <Redirect to="/login" />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
