import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import App from './App';
import Login from "./components/Auth/Login"
import Logout from "./components/Auth/Logout"
import Profile from "./components/Auth/Profile"

import './index.scss';

const routing = (
    <Router>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route path="/login" component={Login}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/profile" component={Profile}/>
            <Route exact path="/lists/:id" component={App}/>
            <Route path="/history" component={App}/>
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
