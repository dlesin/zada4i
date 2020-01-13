import React, {useEffect, useState} from "react";
import {Route, useHistory, Redirect} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {AddList, List, Tasks} from "./components";
import Login from "./components/Auth/Login"

function App() {
    const [colors, setColors] = useState(null);
    const [lists, setLists] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    // const [token, setToken] = useState(null);
    const [auth, setAuth] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
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

    // useEffect(() => {
    //     getToken();
    // }, []);


    const getList = (auth) => {
        axios.get("http://localhost:8000/api/lists/", auth).then(({data}) => {
            setLists(data);
        });
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
                });
                setInterval(getList(auth), 1000 * 10)
            }
        }
    }, [auth, isLogin, history]);

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
                newTask.completed = obj.completed;
            }
            return item
        });
        axios.patch('http://localhost:8000/api/tasks/update/' + obj.task + '/', {
            list: obj.list,
            completed: obj.completed
        }, auth)
            .catch(() => alert('Не удалось обновить задачу...'))
            .finally(() => {
                setLists(newList)
            })
    };

    useEffect(() => {
        const listId = history.location.pathname.split('lists/')[1];
        const list = lists && lists.find(list => list.id === Number(listId));
        setActiveItem(list)
    }, [lists, history.location.pathname]);

    return (
        <div className='todo'>
            {/*<Route exact path="/logout" component={Logout}/>*/}
            {isLogin && <div className='todo__sidebar'>
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
                {lists ? <List
                    items={lists}
                    onRemove={item => onRemove(item)}
                    onClickItem={item => history.push(`/lists/${item.id}`)}
                    activeItem={activeItem}
                    isRemovable={true}
                /> : 'Загрузка...'}
                <AddList onAddList={onAddList} colors={colors}/>
            </div>}
            <div className='todo__tasks'>
                <Route exact path='/'>
                    {lists && lists.map(list =>
                        <Tasks key={list.id} list={list} onAddTask={onAddTask} onEditTitle={onEditListTitle}
                               withoutEmpty={true} onRemoveTask={onRemoveTask} onEditTask={onEditTask}
                               onCompleteTask={onCompleteTask}
                        />
                    )}
                </Route>
                <Route path='/lists/:id'>
                    {lists && activeItem &&
                    <Tasks list={activeItem} onAddTask={onAddTask} onEditTitle={onEditListTitle}
                           onRemoveTask={onRemoveTask} onEditTask={onEditTask}
                           onCompleteTask={onCompleteTask}/>}
                </Route>
            </div>
            {!isLogin ? <Route exact path="/login">
                <Login getToken={getToken}/>
            </Route> : <Redirect to="/"/>}
        </div>
    );
}

export default App;
