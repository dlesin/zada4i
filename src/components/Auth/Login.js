import React, {useState} from 'react';
import "./Auth.scss"
import axios from "axios";
import {useHistory} from "react-router-dom";

const Task = () => {
    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    let history = useHistory();

    const getToken = (obj) => {
        if (obj) {
            axios.post('http://localhost:8000/api/auth/token/login/',
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
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Логин" name="username" value={loginValue}
                       onChange={e => setLoginValue(e.target.value)}/>
                <br/>
                <input type="text" placeholder="Пароль" name="password" value={passwordValue}
                       onChange={e => setPasswordValue(e.target.value)}/>
                <br/>
                <input onClick={onSubmit} type="submit"/>
            </form>
        </div>
    );
};
export default Task;