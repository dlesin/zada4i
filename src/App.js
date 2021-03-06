import React, {useEffect, useReducer, useState} from "react";
import {Link, Route, useHistory} from "react-router-dom";
import {Context} from './context'
import {Reduser} from './reducer'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {AddList, List, Tasks} from "./components";
import History from "./components/Tasks/History"
import Logout from "./components/Auth/Logout";
import Profile from "./components/Auth/Profile";

function App() {

    const API_URL = process.env.REACT_APP_API_URL;

    const [state, dispatch] = useReducer(Reduser, false);
    const [activeItem, setActiveItem] = useState(null);
    // const [myList, setMyList] = useState(null);
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

    const getList = (auth) => {
        const get = () => {
            auth && axios.get(API_URL + "/api/lists/", auth).then(({data}) => dispatch({
                type: 'GET_LISTS',
                payload: data
            }));
        };
        setInterval(get, 60000)
    };

    const getTasks = (auth) => {
        const get = () => {
            auth && axios.get(API_URL + "/api/tasks/", state.auth).then(({data}) => {
                dispatch({
                    type: 'HISTORY_TASK',
                    payload: data
                });
            });
        };
        setInterval(get, 120000)
    };

    const onAddList = (inputValue, color) => {
        axios.post(API_URL + '/api/lists/create/', {
            name: inputValue,
            color: color.id,
            department: state.me.department
        }, state.auth)
            .then(({data}) => {
                const listObj = {...data, color: {name: color.name, hex: color.hex}, tasks: []};
                dispatch({
                    type: 'ADD_LIST',
                    payload: listObj
                })
            });
    };

    const onAddTask = (listId, taskObj) => {
        axios.post(API_URL + '/api/tasks/create/', {
            creator: taskObj.creator,
            executor: taskObj.executor,
            list: listId,
            department: taskObj.department,
            text: taskObj.text,
            completed: taskObj.completed
        }, state.auth)
            .then(({data}) => {
                const newTaskObj = {...taskObj, id: data.id, created_at: data.created_at};
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
                axios.delete(API_URL + "/api/lists/destroy/" + item.id + '/', state.auth).catch(() => {
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
        axios.patch(API_URL + '/api/lists/update/' + id + '/', {name: title}, state.auth)
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
            axios.delete(API_URL + '/api/tasks/destroy/' + taskId + '/', state.auth)
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
                newTask.executor = obj.executor;
            }
            return item
        });
        axios.patch(API_URL + '/api/tasks/update/' + obj.task + '/', {
            list: obj.list,
            text: obj.text,
            executor: obj.executor,
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
        axios.patch(API_URL + '/api/tasks/update/' + obj.task + '/', {
            list: obj.list,
            executor: obj.executor,
            department: obj.department,
            completed: obj.completed,
            comment: obj.comment
        }, state.auth)
            .then(({data}) => {
                const newList = state.lists.map(item => {
                    if (item.id === obj.list) {
                        let newTask = item.tasks.find(task => task.id === obj.task);
                        newTask.comment = obj.comment;
                        newTask.completed = obj.completed;
                        newTask.created_at = data.created_at
                    }
                    return item
                });
                dispatch({
                    type: 'COMPLETE_TASK',
                    payload: newList
                });
            })
            .catch(() => alert('Не удалось обновить задачу...'))
    };

    useEffect(() => {
        state.auth && axios.get(API_URL + "/api/colors/", state.auth).then(({data}) => dispatch({
            type: 'GET_COLORS',
            payload: data
        })).catch(e => {
            if (e.response.status === 401) {
                localStorage.removeItem("token");
                history.push('/login')
            }
        })
    }, [state.auth, API_URL, history]);

    useEffect(() => {
        state.auth && axios.get(API_URL + "/api/auth/users/me/", state.auth).then(({data}) => dispatch({
            type: 'GET_ME',
            payload: data
        })).catch(e => {
            if (e.response.status === 401) {
                localStorage.removeItem("token");
                history.push('/login')
            }
        })
    }, [state.auth, API_URL, history]);

    useEffect(() => {
        state.auth && axios.get(API_URL + "/api/lists/", state.auth).then(({data}) => {
            dispatch({
                type: 'GET_LISTS',
                payload: data
            })
        }).catch(e => {
            if (e.response.status === 401) {
                localStorage.removeItem("token");
                history.push('/login')
            }
        })
    }, [state.auth, API_URL, history]);

    useEffect(() => {
        state.auth && axios.get(API_URL + "/api/department/", state.auth).then(({data}) => dispatch({
            type: 'GET_DEPARTMENT',
            payload: data[0]
        })).catch(e => {
            if (e.response.status === 401) {
                localStorage.removeItem("token");
                history.push('/login')
            }
        })
    }, [state.auth, API_URL, history]);

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
        state.auth && axios.get(API_URL + "/api/tasks/", state.auth).then(({data}) => {
            dispatch({
                type: 'HISTORY_TASK',
                payload: data
            });
        });
    }, [state.auth, API_URL]);

    useEffect(() => {
        const listId = history.location.pathname.split('lists/')[1];
        const list = state.lists && state.lists.find(list => list.id === Number(listId));
        setActiveItem(list)
    }, [state.lists, history.location.pathname]);


    useEffect(() => {
        if (state.lists && state.me) {
            var newList = JSON.parse(JSON.stringify(state.lists))
            let mylist = newList.map(myitem => {
                myitem.tasks = myitem.tasks.filter(task => task.executor === state.me.id);
                return myitem
            });
            dispatch({
                type: 'MY_LIST',
                payload: mylist
            })
        }
    }, [state.lists, history.location.pathname, state.me]);

    useEffect(() => {
        getList(state.auth)
        // eslint-disable-next-line
    }, [state.auth]);

    useEffect(() => {
        getTasks(state.auth)
        // eslint-disable-next-line
    }, [state.auth]);

    // console.log(state);

    return (
        <Context.Provider
            value={{
                state,
                dispatch,
                onAddList,
                onEditListTitle,
                onAddTask,
                onRemoveTask,
                onEditTask,
                onCompleteTask
            }}>
            {state.isload ?
                <div className='todo'>
                    <div className='todo__sidebar'>
                        <div className="todo__department">Отдел: {state.department.name}</div>
                        <ul className="todo__nav">
                            <li>
                                <Link className="todo__profile"
                                      to="/profile"><span>{state.me.first_name} {state.me.last_name}</span></Link>
                            </li>
                            <li>
                                <Link className="todo__logout" to="/logout"><span>Выход</span></Link>
                            </li>
                        </ul>
                        <div>
                            <List
                                onClickItem={() => history.push('/history')}
                                items={[
                                    {
                                        active: history.location.pathname === '/history',
                                        icon: <FontAwesomeIcon icon={faBars}/>,
                                        name: "История"
                                    }
                                ]}
                            />
                            <List onClickItem={() => history.push('/mylist')}
                                  items={[
                                      {
                                          active: history.location.pathname === '/mylist',
                                          icon: <FontAwesomeIcon icon={faBars}/>,
                                          name: "Мои"
                                      }
                                  ]}
                            />
                            <List
                                onClickItem={() => history.push('/')}
                                items={[
                                    {
                                        active: history.location.pathname === '/',
                                        icon: <FontAwesomeIcon icon={faBars}/>,
                                        name: "Все задачи"
                                    }
                                ]}
                            />
                        </div>
                        <List
                            items={state.lists}
                            onRemove={item => onRemove(item)}
                            onClickItem={item => history.push(`/lists/${item.id}`)}
                            activeItem={activeItem}
                            isRemovable={state.me.is_leader}
                        />
                        {state.me.is_leader && <AddList colors={state.colors}/>}
                        <div className="footer">v. {process.env.REACT_APP_VERSION}</div>
                    </div>
                    <div className='todo__tasks'>
                        <Route exact path='/mylist'>
                            {state.mylists.map(item =>
                                <Tasks key={item.id} list={item}/>
                            )}
                        </Route>
                        <Route exact path='/'>
                            {state.lists.map(list =>
                                <Tasks key={list.id} list={list}/>
                            )}
                        </Route>

                        <Route path='/lists/:id'>
                            {activeItem &&
                            <Tasks list={activeItem} currentUser={state.me}
                                   currentDepartment={state.department}/>}
                        </Route>
                        <Route path='/history'>
                            <History auth={state.auth} currentUser={state.me}
                                     currentDepartment={state.department}/>
                        </Route>
                        <Route path='/logout' component={Logout}/>
                        <Route path='/profile' component={Profile}/>
                    </div>
                </div>
                : (
                    <div></div>
                )}
        </Context.Provider>
    );
}

export default App;
