import React from 'react';
import "../Tasks/Tasks.scss"
import "./Auth.scss"
// import axios from "axios";
// import {useHistory} from "react-router-dom";

const Profile = () => {
//     let history = useHistory();
//
//     const onMain = () => {
//         history.push('/')
//     };
//
//     const onLogout = () => {
//         const token = localStorage.getItem("token");
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `token ${token}`
//             }
//         };
//         axios.post('http://localhost:8000/api/auth/token/logout/',
//             {auth_token: token}, config)
//             .then(({data}) => {
//                 localStorage.removeItem("token");
//                 history.push('/')
//             })
//             .catch((e) => {
//                 alert(e.response.data.detail)
//             });
//     };

    return (
        <div className="profile">
           <h1>Профиль</h1>
        </div>
    );
};
export default Profile;