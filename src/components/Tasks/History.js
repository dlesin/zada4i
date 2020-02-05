import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import "./Tasks.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {Context} from "../../context";

const History = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [tasksToSearch, setTasksToSearch] = useState([]);
    const [isLoad, setLoad] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const {state, dispatch} = useContext(Context);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        axios.get(API_URL + "/api/tasks/", state.auth).then(({data}) => {
            dispatch({
                type: 'HISTORY_TASK',
                payload: {
                    tasks: data
                }
            });
        });
        setLoad(true)
    }, [state.auth, API_URL, dispatch]);

    useEffect(() => {
        if (state.department && state.tasks) {
            const userlist = state.department[0].users;
            let newArray = state.tasks.map(item => {
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
    }, [state.tasks, isLoad, state.department]);

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
                    {isLoad && searchResults.map(item => (
                        <div key={item.id} className="tasks__items-row">
                            <div className="tasks__items-row-task">
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