import React, {useState} from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import "./Tasks.scss"

function AddTaskForm({list, currentUser, currentDepartment, onAddTask}) {
    const [visibleForm, setFormVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('Выбери исполнителя');

    const options = currentDepartment && currentDepartment[0].users.map(item => item.last_name + ' ' + item.first_name);

    const onSelect = (value) => {
        setSelectedValue(value);
    };

    const toggleFormVisible = () => {
        setFormVisible(!visibleForm);
        setInputValue('')
    };

    const addTask = () => {
        let last_name;
        if(selectedValue.value) {
            last_name = selectedValue.value.split(' ')[0];
        } else {
            alert('Нужно выбрать исполнителя!');
            return;
        }
        const executorUser = currentDepartment[0].users.find(user => user.last_name === last_name);
        const obj = {
            "creator": currentUser.id,
            "executor": executorUser.id,
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
                    <div className="tasks__form-inline">
                        <input value={inputValue} onChange={e => setInputValue(e.target.value)}
                               type='text' placeholder='Текс задачи' className='field'/>
                        <Dropdown options={options} onChange={onSelect} value={selectedValue}
                                  placeholder="Select an option"/>
                    </div>
                    <button onClick={addTask} className='button'>Добавить задачу</button>
                    <button onClick={toggleFormVisible} className='button button--grey'>Отмена</button>
                </div>)
            }
        </div>
    );
}

export default AddTaskForm;