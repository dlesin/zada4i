import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPen, faTimesCircle} from "@fortawesome/free-solid-svg-icons";

const Task = ({id, text, completed, onRemoveTask, list, onEditTask, onCompleteTask}) => {
    const [visibleForm, setFormVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const toggleFormVisible = () => {
        setFormVisible(!visibleForm);
        setInputValue(text)
    };

    const editTask = () => {
        const obj = {
            "list": list,
            "task": id,
            "text": inputValue,
            "completed": false
        };
        onEditTask(obj);
        toggleFormVisible()
    };

    const onChangeCheckbox = (e) => {
        const obj = {
            "list": list,
            "task": id,
            "completed": e.target.checked
        };
        onCompleteTask(obj)
    };

    return (
        <div>
            {!visibleForm ? (<div key={id} className='tasks__items-row'>
                <div className='checkbox'>
                    <input onClick={onChangeCheckbox} id={`task-${id}`} type='checkbox' defaultChecked={completed}/>
                    <label htmlFor={`task-${id}`}>
                        <FontAwesomeIcon className='checkbox__icon' icon={faCheck}/>
                    </label>
                </div>
                <p>{text}</p>
                <div className="tasks__items-row-actions">
                    <div>
                        <FontAwesomeIcon onClick={toggleFormVisible} className='tasks__pen' icon={faPen}/>
                    </div>
                    <div>
                        <FontAwesomeIcon onClick={() => onRemoveTask(list, id)} className='tasks__pen'
                                         icon={faTimesCircle}/>
                    </div>
                </div>
            </div>) : (
                <div className="tasks__form-block">
                    <input value={inputValue} onChange={e => setInputValue(e.target.value)}
                           type='text' placeholder='Текс задачи' className='field'/>
                    <button onClick={editTask} className='button'>Редактировать задачу</button>
                    <button onClick={toggleFormVisible} className='button button--grey'>Отмена</button>
                </div>)}
        </div>
    );
};
export default Task;