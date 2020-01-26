import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPen, faTimesCircle} from "@fortawesome/free-solid-svg-icons";

const Task = ({
                  id, text, creator, executor, comment, completed, currentUser, currentDepartment,
                  onRemoveTask, list, onEditTask, onCompleteTask
              }) => {
    const [visibleForm, setFormVisible] = useState(false);
    const [commentForm, setCommentFormVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [commentValue, setCommentValue] = useState('');

    const toggleFormVisible = () => {
        setFormVisible(!visibleForm);
        setInputValue(text)
    };
    const toggleCommentFormVisible = () => {
        setCommentFormVisible(!commentForm);
        setCommentValue('')
    };

    const loadExecutorLastName = (executor, currentDepartment) => {
        const userlist = currentDepartment[0].users;
        const obj = userlist.find(user => user.id === executor);
        return obj.last_name
    };

    const loadCreatorLastName = (creator, currentDepartment) => {
        const userlist = currentDepartment[0].users;
        const obj = userlist.find(user => user.id === creator);
        return obj.last_name
    };

    const editTask = () => {
        const obj = {
            "list": list,
            "task": id,
            "text": inputValue,
            "completed": false
        };
        onEditTask(obj);
        toggleFormVisible()
    };

    const onResolveTask = () => {
        executor === currentUser.id ? toggleCommentFormVisible() : alert("Вы не можете закрыть чужую задачу")
    };

    const onChangeCompleteTask = (e) => {
        if (commentValue) {
            const obj = {
                "list": list,
                "task": id,
                "executor": currentUser.id,
                "department": currentUser.department,
                "comment": commentValue,
                "completed": !completed
            };
            onCompleteTask(obj);
            toggleCommentFormVisible();
        }
    };

    return (
        <div>
            {!visibleForm ? (<div key={id} className='tasks__items-row'>
                {!commentForm ? (<div className="tasks__items-row">
                    <div className='checkbox'>
                        <input id={`task-${id}`} type='checkbox'
                               checked={completed} onChange={onResolveTask}/>
                        <label htmlFor={`task-${id}`}>
                            <FontAwesomeIcon className='checkbox__icon' icon={faCheck}/>
                        </label>
                    </div>
                    <p>{text}</p>
                    {comment && completed && <p className="tasks__items-row-comment">Коментарий: {comment}</p>}
                    <p className="tasks__items-row-executor">
                        Исполнитель: {currentDepartment && loadExecutorLastName(executor, currentDepartment)}
                    </p>
                    <p className="tasks__items-row-creator">
                        Создатель: {currentDepartment && loadCreatorLastName(creator, currentDepartment)}
                    </p>
                    {currentUser && currentUser.is_leader && <div className="tasks__items-row-actions">
                        <div>
                            <FontAwesomeIcon onClick={toggleFormVisible} className='tasks__pen' icon={faPen}/>
                        </div>
                        <div>
                            <FontAwesomeIcon onClick={() => onRemoveTask(list, id)} className='tasks__pen'
                                             icon={faTimesCircle}/>
                        </div>
                    </div>}
                </div>) : (
                    <div className="tasks__form-block">
                        <input value={commentValue} onChange={e => setCommentValue(e.target.value)}
                               type='text' placeholder='Комментарий' className='field'/>
                        <button onClick={onChangeCompleteTask} className='button'>Готово</button>
                        <button onClick={toggleCommentFormVisible} className='button button--grey'>Отмена</button>
                    </div>)}
            </div>) : (
                <div className="tasks__form-block">
                    <input value={inputValue} onChange={e => setInputValue(e.target.value)}
                           type='text' placeholder='Текс задачи' className='field'/>
                    <button onClick={editTask} className='button'>Редактировать задачу</button>
                    <button onClick={toggleFormVisible} className='button button--grey'>Отмена</button>
                </div>)}
        </div>
    );
};
export default Task;