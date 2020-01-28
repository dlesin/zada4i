import React, {useEffect, useReducer, useState} from "react";
import {Link, Route, useHistory} from "react-router-dom";
import {Context} from './context'
import {reduser} from './reducer'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {AddList, List, Tasks} from "./components";
import History from "./components/Tasks/History"

function App() {
    const [state, dispatch] = useReducer(reduser, false);
    const [activeItem, setActiveItem] = useState(null);
    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push('/login')
        } else {
            const token = localStorage.getItem("token");
            dispatch({
                type: 'GET_AUTH',
                payload: {
                    auth: {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `token ${token}`
                        }
                    }
                }
            });
        }
    }, [history]);

    const getList = (state) => {
        const get = () => {
            axios.get("http://localhost:8000/api/lists/", state.auth).then(({data}) => dispatch({
                type: 'GET_LISTS',
                payload: {
                    lists: data
                }
            }));
        };
        setInterval(get, 1000 * 30)
    };

    const onAddList = (inputValue, color) => {
        axios.post('http://localhost:8000/api/lists/create/', {
            name: inputValue,
            color: color.id,
            department: state.me.department
        }, state.auth)
            .then(({data}) => {
                const listObj = {...data, color: {name: color.name, hex: color.hex}, tasks: []};
                console.log(listObj)
                dispatch({
                    type: 'ADD_LIST',
                    payload: listObj
                })
            });
    };

    const onAddTask = (listId, taskObj) => {
        axios.post('http://localhost:8000/api/tasks/create/', {
            creator: taskObj.creator,
            executor: taskObj.executor,
            list: listId,
            text: taskObj.text,
            completed: taskObj.completed
        }, state.auth)
            .then(({data}) => {
                const newTaskObj = {...taskObj, id: data.id};
                const newList = state.lists.map(item => {
                    if (item.id === listId) {
                        item.tasks ? item.tasks = [...item.tasks, newTaskObj] : item.tasks = [newTaskObj]
                    }
                    return item
                });
                dispatch({
                    type: 'ADD_TASK',
                    payload: newList
                });
            })
            .catch(() => alert('Ошибка созданя задачи...'))
    };

    const onRemove = item => {
        const newList = state.lists.filter(list => {
            if (list.id === item.id) {
                axios.delete("http://localhost:8000/api/lists/destroy/" + item.id + '/', state.auth).catch(() => {
                    alert('Не удалось удалить список...')
                });
                return false
            } else {
                return true
            }
        });
        dispatch({
            type: 'REMOVE_LIST',
            payload: newList
        });
    };

    const onEditListTitle = (id, title) => {
        const newList = state.lists.map(item => {
            if (item.id === id) {
                item.name = title
            }
            return item
        });
        axios.patch('http://localhost:8000/api/lists/update/' + id + '/', {name: title}, state.auth)
            .catch(() => alert('Не удалось обновить название'))
            .finally(() => {
                dispatch({
                    type: 'EDIT_LIST',
                    payload: newList
                });
            })
    };

    const onRemoveTask = (listId, taskId) => {
        if (window.confirm('Удалить задачу?')) {
            const newList = state.lists.map(item => {
                if (item.id === listId) {
                    item.tasks = item.tasks.filter(task => task.id !== taskId)
                }
                return item
            });
            dispatch({
                type: 'REMOVE_TASK',
                payload: newList
            });
            axios.delete('http://localhost:8000/api/tasks/destroy/' + taskId + '/', state.auth)
                .catch(() => {
                    alert('Не удалось удалить задачу...')
                })
        }
    };

    const onEditTask = (obj) => {
        const newList = state.lists.map(item => {
            if (item.id === obj.list) {
                let newTask = item.tasks.find(task => task.id === obj.task);
                newTask.text = obj.text;
                item.tasks.text = obj.text
            }
            return item
        });
        axios.patch('http://localhost:8000/api/tasks/update/' + obj.task + '/', {
            list: obj.list,
            text: obj.text,
            completed: obj.completed
        }, state.auth)
            .catch(() => alert('Не удалось обновить задачу...'))
            .finally(() => {
                dispatch({
                    type: 'EDIT_TASK',
                    payload: newList
                });
            })
    };

    const onCompleteTask = obj => {
        const newList = state.lists.map(item => {
            if (item.id === obj.list) {
                let newTask = item.tasks.find(task => task.id === obj.task);
                newTask.comment = obj.comment;
                newTask.completed = obj.completed;
            }
            return item
        });
        axios.patch('http://localhost:8000/api/tasks/update/' + obj.task + '/', {
            list: obj.list,
            executor: obj.executor,
            department: obj.department,
            completed: obj.completed,
            comment: obj.comment
        }, state.auth)
            .catch(() => alert('Не удалось обновить задачу...'))
            .finally(() => {
                dispatch({
                    type: 'COMPLETE_TASK',
                    payload: newList
                });
            })
    };

    useEffect(() => {
        // if (state.auth) {
        state.auth && axios.get("http://localhost:8000/api/colors/", state.auth).then(({data}) => dispatch({
            type: 'GET_COLORS',
            payload: {
                colors: data
            }
        }));
    }, [state.auth]);

    useEffect(() => {
        state.auth && axios.get("http://localhost:8000/api/auth/users/me/", state.auth).then(({data}) => dispatch({
            type: 'GET_ME',
            payload: {
                me: data
            }
        }));
    }, [state.auth]);

    useEffect(() => {
        state.auth && axios.get("http://localhost:8000/api/lists/", state.auth).then(({data}) => dispatch({
            type: 'GET_LISTS',
            payload: {
                lists: data
            }
        }));
    }, [state.auth]);

    useEffect(() => {
        state.auth && axios.get("http://localhost:8000/api/department/", state.auth).then(({data}) => dispatch({
            type: 'GET_DEPARTMENT',
            payload: {
                department: data
            }
        }));
    }, [state.auth]);

    useEffect(() => {
        state.auth && state.me && state.lists && state.colors && state.department ?
            dispatch({
                type: 'IS_LOAD',
                payload: {
                    isload: true
                }
            }) :
            dispatch({
                type: 'IS_LOAD',
                payload: {
                    isload: false
                }
            })
    }, [state.auth, state.me, state.lists, state.colors, state.department]);

    useEffect(() => {
        const listId = history.location.pathname.split('lists/')[1];
        const list = state.lists && state.lists.find(list => list.id === Number(listId));
        setActiveItem(list)
    }, [state.lists, history.location.pathname]);
    console.log(state)
    return (
        <Context.Provider value={{onAddList}}>
            {state.isload ?
                <div className='todo'>
                    <div className='todo__sidebar'>
                        <div className="todo__department">Отдел: {state.department && state.department[0].name}</div>
                        <ul className="todo__nav">
                            <li>
                                <Link className="todo__profile"
                                      to="/profile"><span>{state.me && state.me.first_name} {state.me && state.me.last_name}</span></Link>
                            </li>
                            <li>
                                <Link className="todo__logout" to="/logout"><span>Выход</span></Link>
                            </li>
                        </ul>
                        <List
                            onClickItem={item => history.push('/history')}
                            items={[
                                {
                                    active: history.location.pathname === '/history',
                                    icon: <FontAwesomeIcon icon={faBars}/>,
                                    name: "История"
                                }
                            ]}
                        />
                        <List
                            onClickItem={item => history.push('/')}
                            items={[
                                {
                                    active: history.location.pathname === '/',
                                    icon: <FontAwesomeIcon icon={faBars}/>,
                                    name: "Все задачи"
                                }
                            ]}
                        />
                        {state.me && <List
                            items={state.lists}
                            onRemove={item => onRemove(item)}
                            onClickItem={item => history.push(`/lists/${item.id}`)}
                            activeItem={activeItem}
                            isRemovable={state.me.is_leader}
                        />}
                        {state.me && state.me.is_leader && <AddList colors={state.colors}/>}
                    </div>
                    <div className='todo__tasks'>
                        <Route exact path='/'>
                            {state.lists && state.lists.map(list =>
                                <Tasks key={list.id} list={list} currentUser={state.me}
                                       currentDepartment={state.department}
                                       onAddTask={onAddTask}
                                       onEditTitle={onEditListTitle}
                                       withoutEmpty={true} onRemoveTask={onRemoveTask} onEditTask={onEditTask}
                                       onCompleteTask={onCompleteTask}
                                />
                            )}
                        </Route>
                        <Route path='/lists/:id'>
                            {state.lists && activeItem &&
                            <Tasks list={activeItem} currentUser={state.me} currentDepartment={state.department}
                                   onAddTask={onAddTask}
                                   onEditTitle={onEditListTitle}
                                   onRemoveTask={onRemoveTask} onEditTask={onEditTask}
                                   onCompleteTask={onCompleteTask}/>}
                        </Route>
                        <Route path='/history'>
                            <History auth={state.auth} currentUser={state.me} currentDepartment={state.department}/>
                        </Route>
                    </div>
                </div>
                : (
                    <div></div>
                )}
        </Context.Provider>
    );
}

export default App;
