import React from 'react';
import "../Tasks/Tasks.scss"
import "./Auth.scss"
import axios from "axios";
import {useHistory} from "react-router-dom";

const Logout = () => {

    const API_URL = process.env.REACT_APP_API_URL;
    let history = useHistory();

    const onMain = () => {
        history.push('/')
    };

    const onLogout = () => {
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${token}`
            }
        };
        axios.post(API_URL + '/api/auth/token/logout/',
            {auth_token: token}, config)
            .then(({data}) => {
                localStorage.removeItem("token");
                history.push('/')
            })
            .catch((e) => {
                alert(e.response.data.detail)
            });
    };

    return (
        <div className="logout">
            <button onClick={onMain} className='button' style={{marginRight: "20px"}}>На главную</button>
            <button onClick={onLogout} className='button button--grey'>Выйти</button>
        </div>
    );
};
export default Logout;