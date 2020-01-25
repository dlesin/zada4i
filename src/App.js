import React, {useEffect, useState} from "react";
import {Link, Route, useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {AddList, List, Tasks} from "./components";
import Login from "./components/Auth/Login"

function App() {
    const [colors, setColors] = useState(null);
    const [lists, setLists] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [user, setUser] = useState(null);
    const [department, setDepartmen] = useState(null);
    const [auth, setAuth] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isRemovable, setRemovable] = useState(false);
    const [isLoad, setLoad] = useState(false);
    let history = useHistory();

    const getToken = (obj) => {
        if (obj) {
            axios.post('http://localhost:8000/api/auth/token/login/',
                {username: obj.login, password: obj.password})
                .then(({data}) => {
                    localStorage.setItem("token", data.auth_token);
                    // setToken(data.auth_token);
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `token ${data.auth_token}`
                        }
                    };
                    setAuth(config);
                    setIsLogin(true);
                    history.push('/')
                    // return config
                })
                .catch((e) => {
                    alert(e.response.data.non_field_errors)
                });
        } else {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${token}`
                }
            };
            // setToken(token);
            setAuth(config);
            setIsLogin(true);
            history.push('/');
            return config
        }
    };

    const getList = (auth) => {
        const get = () => {
            axios.get("http://localhost:8000/api/lists/", auth).then(({data}) => {
                setLists(data);
            });
        };
        setInterval(get, 1000 * 30)
    };


    const onAddList = (inputValue, color) => {
        // const auth = getToken();
        axios.post('http://localhost:8000/api/lists/create/', {name: inputValue, color: color.id}, auth)
            .then(({data}) => {
                const listObj = {...data, color: {name: color.name, hex: color.hex}, tasks: []};
                const newList = [...lists, listObj];
                setLists(newList);
            });
    };

    const onAddTask = (listId, taskObj) => {
        axios.post('http://localhost:8000/api/tasks/create/', {
            creator: taskObj.creator,
            executor: taskObj.executor,
            list: listId,
            text: taskObj.text,
            completed: taskObj.completed
        }, auth)
            .then(({data}) => {
                const newTaskObj = {...taskObj, id: data.id};
                const newList = lists.map(item => {
                    if (item.id === listId) {
                        item.tasks ? item.tasks = [...item.tasks, newTaskObj] : item.tasks = [newTaskObj]
                    }
                    return item
                });
                setLists(newList);
            })
            .catch(() => alert('Ошибка созданя задачи...'))
    };

    const onRemove = item => {
        const newList = lists.filter(list => {
            // return list.id === item.id ? true : false
            if (list.id === item.id) {
                axios.delete("http://localhost:8000/api/lists/destroy/" + item.id + '/', auth).catch(() => {
                    alert('Не удалось удалить список...')
                });
                return false
            } else {
                return true
            }
        });
        setLists(newList)
    };

    const onEditListTitle = (id, title) => {
        const newList = lists.map(item => {
            if (item.id === id) {
                item.name = title
            }
            return item
        });
        axios.patch('http://localhost:8000/api/lists/update/' + id + '/', {name: title}, auth)
            .catch(() => alert('Не удалось обновить название'))
            .finally(() => {
                setLists(newList);
            })
    };

    const onRemoveTask = (listId, taskId) => {
        if (window.confirm('Удалить задачу?')) {
            const newList = lists.map(item => {
                if (item.id === listId) {
                    item.tasks = item.tasks.filter(task => task.id !== taskId)
                }
                return item
            });
            setLists(newList);
            axios.delete('http://localhost:8000/api/tasks/destroy/' + taskId + '/', auth)
                .catch(() => {
                    alert('Не удалось удалить задачу...')
                })
        }
    };

    const onEditTask = (obj) => {
        const newList = lists.map(item => {
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
        }, auth)
            .catch(() => alert('Не удалось обновить задачу...'))
            .finally(() => {
                setLists(newList)
            })
    };

    const onCompleteTask = obj => {
        const newList = lists.map(item => {
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
        }, auth)
            .catch(() => alert('Не удалось обновить задачу...'))
            .finally(() => {
                setLists(newList)
            })
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push('/login')
        } else {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${token}`
                }
            };
            if (!isLogin) {
                setAuth(config);
                setIsLogin(true);
            }
            if (auth) {
                axios.get("http://localhost:8000/api/colors/", auth).then(({data}) => {
                    setColors(data);
                    setLoad(true)
                });
                axios.get("http://localhost:8000/api/auth/users/me/", auth).then(({data}) => {
                    setUser(data);
                    data.is_leader ? setRemovable(true) : setRemovable(false);
                    setLoad(true)
                });
                axios.get("http://localhost:8000/api/lists/", auth).then(({data}) => {
                    setLists(data);
                    setLoad(true)
                });
                axios.get("http://localhost:8000/api/department/", auth).then(({data}) => {
                    setDepartmen(data);
                    setLoad(true)
                });
                getList(auth);
            }
        }
    }, [auth, isLogin, history]);

    useEffect(() => {
        const listId = history.location.pathname.split('lists/')[1];
        const list = lists && lists.find(list => list.id === Number(listId));
        setActiveItem(list)
    }, [lists, history.location.pathname]);

    return (isLoad ?
            <div className='todo'>
                {isLogin && <div className='todo__sidebar'>
                    <div className="todo__department">Отдел: {department && department[0].name}</div>
                    <ul className="todo__nav">
                        <li>
                            <Link className="todo__profile"
                                  to="/profile"><span>{user && user.first_name} {user && user.last_name}</span></Link>
                        </li>
                        <li>
                            <Link className="todo__logout" to="/logout"><span>Выход</span></Link>
                        </li>
                    </ul>
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
                    <List
                        items={lists}
                        onRemove={item => onRemove(item)}
                        onClickItem={item => history.push(`/lists/${item.id}`)}
                        activeItem={activeItem}
                        isRemovable={isRemovable}
                    />
                    {user && user.is_leader && <AddList onAddList={onAddList} colors={colors}/>}
                </div>}
                <div className='todo__tasks'>
                    <Route exact path='/'>
                        {lists && lists.map(list =>
                            <Tasks key={list.id} list={list} currentUser={user} currentDepartment={department}
                                   onAddTask={onAddTask}
                                   onEditTitle={onEditListTitle}
                                   withoutEmpty={true} onRemoveTask={onRemoveTask} onEditTask={onEditTask}
                                   onCompleteTask={onCompleteTask}
                            />
                        )}
                    </Route>
                    <Route path='/lists/:id'>
                        {lists && activeItem &&
                        <Tasks list={activeItem} currentUser={user} currentDepartment={department} onAddTask={onAddTask}
                               onEditTitle={onEditListTitle}
                               onRemoveTask={onRemoveTask} onEditTask={onEditTask}
                               onCompleteTask={onCompleteTask}/>}
                    </Route>
                </div>

                {!isLogin && <Route exact path="/login">
                    <Login getToken={getToken}/>
                </Route>}
            </div> :
            (<div></div>)
    );
}

export default App;
