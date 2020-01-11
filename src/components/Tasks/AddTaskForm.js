import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import "./Tasks.scss"

function AddTaskForm({list, onAddTask}) {
    const [visibleForm, setFormVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const toggleFormVisible = () => {
        setFormVisible(!visibleForm);
        setInputValue('')
    };
    const addTask = () => {
        const obj = {
            "list": list.id,
            "text": inputValue,
            "completed": false
        };
        onAddTask(list.id, obj);
        toggleFormVisible()
    };
    return (
        <div className="tasks__form">
            {!visibleForm ? (<div onClick={toggleFormVisible} className="tasks__form-new">
                <FontAwesomeIcon className="tasks__plus" icon={faPlus}/>
                <span>Новая задача</span>
            </div>) : (
                <div className="tasks__form-block">
                    <input value={inputValue} onChange={e => setInputValue(e.target.value)}
                           type='text' placeholder='Текс задачи' className='field'/>
                    <button onClick={addTask} className='button'>Добавить задачу</button>
                    <button onClick={toggleFormVisible} className='button button--grey'>Отмена</button>
                </div>)
            }
        </div>
    );
}

export default AddTaskForm;