import React, {useContext, useEffect, useState} from 'react';
import "./Tasks.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {Context} from "../../context";

const History = () => {
    const [isLoad, setLoad] = useState(false);
    const [tasksToSearch, setTasksToSearch] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const {state} = useContext(Context);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (state.department && state.tasks) {
            const userlist = state.department.users;
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
            setLoad(true)
        }
    }, [state.tasks, isLoad, state.department]);

    useEffect(() => {
        const searchResults = tasksToSearch;
        const results = searchResults.filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase())
            || item.created_at.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.executor.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm, tasksToSearch]);

    return (isLoad ?
            <div className="tasks">
                <div className="tasks__title">
                    <input className="field field-mini" type="text" placeholder="Поиск" value={searchTerm}
                           onChange={handleChange}/>
                </div>

                <div className='tasks__items'>
                    {searchResults.map(item => (
                        <div key={item.id} className="tasks__items-row">
                            <div className="tasks__items-row-task">
                                <div className='checkbox'>
                                    <input id={`task-${item.id}`} type='checkbox'
                                           checked={item.completed} readOnly/>
                                    <label htmlFor={`task-${item.id}`}>
                                        <FontAwesomeIcon className='checkbox__icon' icon={faCheck}/>
                                    </label>
                                </div>
                                <div className="tasks__items-row-text">
                                    {item.text}
                                </div>
                            </div>
                            <div className="tasks__items-info">
                                {item.comment &&
                                <div className="tasks__items-row-comment">Ком: {item.comment}</div>}
                                <div className="tasks__items-row-executor">
                                    Исп: {item.executor}
                                </div>
                                <div className="tasks__items-row-executor">
                                    Соз: {item.executor}
                                </div>
                                <div className="tasks__items-row-comment">{item.created_at}</div>
                            </div>
                        </div>))
                    }
                </div>
            </div> : <div></div>
    );
};
export default History;