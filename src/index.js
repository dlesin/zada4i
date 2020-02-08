import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import App from './App';
import Login from "./components/Auth/Login"
import './index.scss';


const routing = (
    <Router>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route path="/login" component={Login}/>
            <Route path="/logout" component={App}/>
            <Route path="/profile" component={App}/>
            <Route exact path="/lists/:id" component={App}/>
            <Route path="/history" component={App}/>
            <Route path="/mylist" component={App}/>
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
