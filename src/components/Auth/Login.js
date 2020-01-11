import React, {useState} from 'react';


const Task = ({getToken}) => {
    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    // const toggleFormVisible = () => {
    //     setFormVisible(!visibleForm);
    //     // setInputValue(text)
    // };

    const onSubmit = (e) => {
        e.preventDefault();
        const obj = {
            login: loginValue,
            password: passwordValue
        };
        getToken(obj)
    };
    //
    // const onChangeCheckbox = (e) => {
    //     const obj = {
    //         "list": list,
    //         "task": id,
    //         "completed": e.target.checked
    //     };
    //     onCompleteTask(obj)
    // };

    return (
        <div>
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