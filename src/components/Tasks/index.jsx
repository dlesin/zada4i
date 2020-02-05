import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {Context} from '../../context'
import "./Tasks.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import AddTaskForm from "./AddTaskForm";
import Task from "./Task";

export default function Tasks({list, withoutEmpty}) {
    const {state, onEditListTitle} = useContext(Context);

    const editTitle = () => {
        const newTitle = window.prompt('Название списка', list.name);
        newTitle && onEditListTitle(list.id, newTitle)
    };
    return (
        <div className='tasks'>
            <Link to={`/lists/${list.id}`}>
                <h2 style={{color: list.color.hex}} className='tasks__title'>
                    {list.name}
                    {state.me.is_leader &&
                    <FontAwesomeIcon className='tasks__pen' onClick={editTitle} icon={faPen}/>}
                </h2>
            </Link>
            <div className='tasks__items'>
                {/*{!withoutEmpty && !list.tasks.length && <h2>Задачи отсутствуют...</h2>}*/}
                {list.tasks.map(task =>
                    <Task key={task.id} list={list} {...task}/>
                )}
                <AddTaskForm list={list}/>
            </div>
        </div>
    );
}