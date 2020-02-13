import React, {useContext, useState} from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import "./Tasks.scss"
import {Context} from "../../context";

function AddTaskForm({list}) {
    const [visibleForm, setFormVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('Выбери исполнителя');
    const {state, onAddTask} = useContext(Context);

    const options = state.department && state.department.users.map(item => item.last_name + ' ' + item.first_name).sort();

    const onSelect = (value) => {
        setSelectedValue(value);
    };

    const toggleFormVisible = () => {
        setFormVisible(!visibleForm);
        setInputValue('')
    };

    const addTask = () => {
        let last_name;
        let executorUser;
        if (state.me.is_leader) {
            if (selectedValue.value) {
                last_name = selectedValue.value.split(' ')[0];
                executorUser = state.department.users.find(user => user.last_name === last_name);
            } else {
                alert('Нужно выбрать исполнителя!');
                return;
            }
        } else {
            executorUser = state.me
        }
        const obj = {
            "creator": state.me.id,
            "executor": executorUser.id,
            "department": state.me.department,
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
                        {state.me.is_leader && <Dropdown options={options} onChange={onSelect} value={selectedValue}
                                                         placeholder="Select an option"/>}
                    </div>
                    <button onClick={addTask} className='button'>Добавить задачу</button>
                    <button onClick={toggleFormVisible} className='button button--grey'>Отмена</button>
                </div>)
            }
        </div>
    );
}

export default AddTaskForm;