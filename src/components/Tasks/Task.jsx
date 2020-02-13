import React, {useContext, useState} from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPen, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {Context} from "../../context";

const Task = ({id, text, creator, executor, comment, completed, priority, created_at, list}) => {
    const [visibleForm, setFormVisible] = useState(false);
    const [commentForm, setCommentFormVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [commentValue, setCommentValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('Выбери исполнителя');
    const [visiblePopup, setVisiblePopup] = useState(false);
    const {state, onRemoveTask, onEditTask, onCompleteTask} = useContext(Context);

    const options = state.department && state.department.users.map(item => item.last_name + ' ' + item.first_name).sort();

    const onSelect = (value) => {
        setSelectedValue(value);
    };

    const toggleFormVisible = () => {
        setFormVisible(!visibleForm);
        setInputValue(text)
    };

    const toggleCommentFormVisible = () => {
        setCommentFormVisible(!commentForm);
        setCommentValue('')
    };

    const loadExecutorLastName = (executor, currentDepartment) => {
        const userlist = currentDepartment.users;
        const obj = userlist.find(user => user.id === executor);
        return obj.last_name
    };

    const editTask = () => {
        let last_name;
        if (selectedValue.value) {
            last_name = selectedValue.value.split(' ')[0];
        } else {
            alert('Нужно выбрать исполнителя!');
            return;
        }
        const executorUser = state.department.users.find(user => user.last_name === last_name);
        const obj = {
            "list": list,
            "task": id,
            "executor": executorUser.id,
            "text": inputValue,
            "completed": false
        };
        onEditTask(obj);
        toggleFormVisible()
    };

    const onResolveTask = () => {
        executor === state.me.id ? toggleCommentFormVisible() : alert("Вы не можете закрыть чужую задачу")
    };

    const onChangeCompleteTask = (e) => {
        if (commentValue) {
            const obj = {
                "list": list,
                "task": id,
                "executor": state.me.id,
                "department": state.me.department,
                "comment": commentValue,
                "completed": !completed,
            };
            onCompleteTask(obj);
            toggleCommentFormVisible();
        }
    };

    return (
        <div>
            {!visibleForm ? (
                <div key={id}>
                    {!commentForm ? (
                        <div className='tasks__items-row'>
                            <div className="tasks__items-row-task">
                                <div className='checkbox'>
                                    <input id={`task-${id}`} type='checkbox'
                                           checked={completed} onChange={onResolveTask}/>
                                    {priority ? (<label htmlFor={`task-${id}`} style={{"border": "1px solid red"}}>
                                            <FontAwesomeIcon className='checkbox__icon' icon={faCheck}/>
                                        </label>) :
                                        (<label htmlFor={`task-${id}`}>
                                            <FontAwesomeIcon className='checkbox__icon' icon={faCheck}/>
                                        </label>)}
                                </div>
                                <div onMouseEnter={() => setVisiblePopup(true)}
                                     onMouseLeave={() => setVisiblePopup(false)}
                                     className="tasks__items-row-text">
                                    {text}
                                </div>
                                {visiblePopup && <div className="tasks__items-row-popup">{text}</div>}
                                {state.me.is_leader && <div className="tasks__items-row-actions">
                                    <div>
                                        <FontAwesomeIcon onClick={toggleFormVisible} className='tasks__pen'
                                                         icon={faPen}/>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon onClick={() => onRemoveTask(list, id)} className='tasks__pen'
                                                         icon={faTimesCircle}/>
                                    </div>
                                </div>}
                            </div>
                            <div className="tasks__items-info">
                                {comment && completed &&
                                <div className="tasks__items-row-comment">Ком: {comment}</div>}
                                <div className="tasks__items-row-executor">
                                    Исп: {loadExecutorLastName(executor, state.department)}
                                </div>
                                <div className="tasks__items-row-date">{created_at}</div>
                            </div>
                        </div>) : (
                        <div className="tasks__form-block">
                            <input value={commentValue} onChange={e => setCommentValue(e.target.value)}
                                   type='text' placeholder='Комментарий' className='field'/>
                            <button onClick={onChangeCompleteTask} className='button'>Готово</button>
                            <button onClick={toggleCommentFormVisible} className='button button--grey'>Отмена</button>
                        </div>)}
                </div>) : (
                <div className="tasks__form-block">
                    <div className="tasks__form-inline">
                        <input value={inputValue} onChange={e => setInputValue(e.target.value)}
                               type='text' placeholder='Текс задачи' className='field'/>
                        <Dropdown options={options} onChange={onSelect} value={selectedValue}
                                  placeholder="Select an option"/>
                    </div>
                    <button onClick={editTask} className='button'>Редактировать задачу</button>
                    <button onClick={toggleFormVisible} className='button button--grey'>Отмена</button>
                </div>)}
        </div>
    );
};
export default Task;