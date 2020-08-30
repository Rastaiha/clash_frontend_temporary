import React from 'react';
import Login from './Login.js';
import Board from './Board.js';

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
          <Route path="/board">
            <Board />
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
