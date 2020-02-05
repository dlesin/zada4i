import React, {useState} from 'react';
import "./Auth.scss"
import axios from "axios";
import {useHistory} from "react-router-dom";

const Login = () => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    let history = useHistory();

    const getToken = (obj) => {
        if (obj) {
            axios.post(API_URL + '/api/auth/token/login/',
                {username: obj.login, password: obj.password})
                .then(({data}) => {
                    localStorage.setItem("token", data.auth_token);
                    history.push('/')
                })
                .catch((e) => {
                    alert(e.response.data.non_field_errors)
                });
        } else {
            history.push('/');
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const obj = {
            login: loginValue,
            password: passwordValue
        };
        getToken(obj)
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form className="login__form">
                <input className="field field-w100" type="text" placeholder="Логин" name="username" value={loginValue}
                       onChange={e => setLoginValue(e.target.value)}/>
                <input className="field field-w100" type="text" placeholder="Пароль" name="password" value={passwordValue}
                       onChange={e => setPasswordValue(e.target.value)}/>
                <input className="button" onClick={onSubmit} type="submit"/>
            </form>
        </div>
    );
};
export default Login;