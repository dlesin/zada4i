import React from "react";
import {Link} from "react-router-dom";
import "./Tasks.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import AddTaskForm from "./AddTaskForm";
import Task from "./Task";

export default function Tasks({
                                  list, currentUser, currentDepartment, onEditTitle, onAddTask, withoutEmpty,
                                  onRemoveTask, onEditTask, onCompleteTask
                              }) {

    const editTitle = () => {
        const newTitle = window.prompt('Название списка', list.name);
        newTitle && onEditTitle(list.id, newTitle)
    };
    return (
        <div className='tasks'>
            <Link to={`/lists/${list.id}`}>
                <h2 style={{color: list.color.hex}} className='tasks__title'>
                    {list.name}
                    {currentUser && currentUser.is_leader &&
                    <FontAwesomeIcon className='tasks__pen' onClick={editTitle} icon={faPen}/>}
                </h2>
            </Link>
            <div className='tasks__items'>
                {!withoutEmpty && list.tasks && !list.tasks.length && <h2>Задачи отсутствуют...</h2>}
                {list.tasks && list.tasks.map(task =>
                    <Task key={task.id} list={list} onRemoveTask={onRemoveTask} onEditTask={onEditTask}
                          {...task} currentUser={currentUser} currentDepartment={currentDepartment}
                          onCompleteTask={onCompleteTask}/>
                )}
                {currentUser && currentUser.is_leader && <AddTaskForm list={list} currentUser={currentUser} currentDepartment={currentDepartment}
                             onAddTask={onAddTask}/>}
            </div>
        </div>
    );
}
