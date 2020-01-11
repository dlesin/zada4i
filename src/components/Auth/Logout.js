import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"
// import PropTypes from 'prop-types';

export default class Login extends Component {
    constructor(props) {
        super(props);
        let loggedIn = false;
        this.state = {
            username: '',
            password: '',
            loggedIn
        };
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    submitForm(e) {
        e.preventDefault();
        const {username, password} = this.state;
        axios.post('http://localhost:8000/api/auth/token/login/', {username: username, password: password})
            .then(({data}) => {
                localStorage.setItem("token", data.auth_token);
                this.setState({
                    loggedIn: true
                })
            });
    }

    render() {
        if (this.state.loggedIn) {
            return <Redirect to="/"/>
        }
        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={this.submitForm}>
                    <input type="text" placeholder="Логин" name="username" value={this.state.username}
                           onChange={this.onChange}/>
                    <br/>
                    <input type="text" placeholder="Пароль" name="password" value={this.state.password}
                           onChange={this.onChange}/>
                    <br/>
                    <input type="submit"/>
                </form>
            </div>
        );
    }
}
