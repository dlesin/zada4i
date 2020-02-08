import React, {useContext, useState} from 'react';
import "../Tasks/Tasks.scss"
import "./Auth.scss"
import {Context} from "../../context";
import {useHistory} from "react-router-dom";
import axios from "axios";


const Profile = () => {
    const [oldPassword, setSetOldPassword] = useState('');
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const {state} = useContext(Context);
    const API_URL = process.env.REACT_APP_API_URL;
    let history = useHistory();

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'

    const onChangePassword = () => {
        if (inputValue1 !== inputValue2) {
            alert("Новые пароли не совпадают")
        }
        axios.post(API_URL + '/api/auth/users/set_password/', {
            new_password: inputValue1,
            current_password: oldPassword
        }, state.auth)
            .then(() => alert("Пароль изменён"))
            .catch(e => {
                if (e.response.data.new_password) {
                    alert(e.response.data.new_password[0])
                } else {
                    alert(e.response.data.current_password)
                }
                return
            });
        history.push("/")
    };

    return (
        <div className="profile">
            <div className="profile__title">
                <h4>Я {state.me.first_name} {state.me.last_name} хочу сменить пароль</h4>
            </div>
            <form onSubmit={onChangePassword}>
                <div>
                    <input value={oldPassword} onChange={e => setSetOldPassword(e.target.value)} type='text'
                           placeholder='Старый пароль' className='field' style={{margin: "0 0 20px 0"}}
                           required={true}/>
                </div>
                <div>
                    <input value={inputValue1} onChange={e => setInputValue1(e.target.value)} type='text'
                           placeholder='Новый пароль' className='field' style={{margin: "0 0 20px 0"}}
                           required={true}/>
                </div>
                <div>
                    <input value={inputValue2} onChange={e => setInputValue2(e.target.value)} type='text'
                           placeholder='Новый пароль ещё раз' className='field' style={{margin: "0 0 20px 0"}}
                           required={true}/>
                </div>
                <button type="subbmit" className='button button--green'>Коммит</button>
            </form>
        </div>
    );
};
export default Profile;