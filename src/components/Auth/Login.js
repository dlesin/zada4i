import React, {useState} from 'react';
import "./Auth.scss"


const Task = ({getToken}) => {
    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

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