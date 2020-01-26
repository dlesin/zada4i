import React, {useEffect, useState} from 'react';
import axios from "axios";
import "./Tasks.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

const History = ({auth, currentUser, currentDepartment}) => {
    const [tasks, setTasks] = useState([]);
    const [tasksToSearch, setTasksToSearch] = useState([]);
    const [isLoad, setLoad] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        axios.get("http://localhost:8000/api/tasks/", auth).then(({data}) => {
            setTasks(data);
            setLoad(true)
        });
    }, [auth]);

    useEffect(() => {
        if (currentDepartment && tasks) {
            const userlist = currentDepartment[0].users;
            let newArray = tasks.map(item => {
                const executor = userlist.find(user => user.id === item.executor);
                if (executor && item.executor === executor.id) {
                    item.executor = executor.last_name
                }
                const creator = userlist.find(user => user.id === item.creator);
                if (creator && item.executor === creator.id) {
                    item.executor = creator.last_name
                }
                return item
            });
            setTasksToSearch(newArray);
        }
    }, [tasks, isLoad, currentDepartment]);

    const searchArray = tasksToSearch;

    useEffect(() => {
        const searchResults = searchArray;
        const results = searchResults.filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase())
            || item.created_at.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.executor.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm, searchArray]);

    return (isLoad ? (
            <div className="tasks">
                <div className="tasks__title">
                    <input className="field field-mini" type="text" placeholder="Поиск" value={searchTerm}
                           onChange={handleChange}/>
                </div>
                <div className='tasks__items'>
                    {tasks && searchResults.map(item => (
                        <div key={item.id} className="tasks__items-row">
                            <div className="tasks__items-row">
                                <div className='checkbox'>
                                    <input id={`task-${item.id}`} type='checkbox'
                                           checked={item.completed} readOnly/>
                                    <label htmlFor={`task-${item.id}`}>
                                        <FontAwesomeIcon className='checkbox__icon' icon={faCheck}/>
                                    </label>
                                </div>
                                <p>{item.text}</p>
                            </div>
                            <div className="tasks__items-info">
                                {item.comment &&
                                <div className="tasks__items-row-comment">Коментарий: {item.comment}</div>}
                                <div className="tasks__items-row-executor">
                                    Исполнитель: {item.executor}
                                </div>
                                <div className="tasks__items-row-executor">
                                    Создатель: {item.executor}
                                </div>
                                <div className="tasks__items-row-comment">Создано: {item.created_at}</div>
                            </div>
                        </div>))
                    }
                </div>
            </div>) : <div></div>
    );
};
export default History;