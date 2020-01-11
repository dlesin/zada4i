import React from "react";
import "./List.scss";
import classNames from "classnames";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import Badge from "../Badge";

const List = ({items, isRemovable, onClick, onRemove, onClickItem, activeItem}) => {
    const removeList = item => {
        if (window.confirm("Удалить?")) {
            onRemove(item);
        }
    };

    return (
        <ul onClick={onClick} className='list'>
            {items && items.map((item, index) => (
                <li key={index}
                    className={classNames(item.className, {active: item.active ?
                            item.active :
                            activeItem && activeItem.id === item.id})}
                    onClick={onClickItem ? () => onClickItem(item) : null}
                >
                    <i>{item.icon ? item.icon : <Badge color={item.color}/>}</i>
                    <span>{item.name}{item.tasks && item.tasks.length > 0 && ` (${item.tasks.length})`}</span>
                    {isRemovable && (
                        <FontAwesomeIcon
                            onClick={() => removeList(item)}
                            className='list__remove-icon'
                            icon={faTimesCircle}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default List;
