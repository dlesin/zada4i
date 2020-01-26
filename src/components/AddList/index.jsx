import React, {useEffect, useState} from "react";
import Badge from "../Badge";
import List from "../List";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import "./AddList.scss";


const AddList = ({colors, onAddList}) => {
    const [visiblePopup, setViseblePopup] = useState(false);
    const [selectedColor, selectColor] = useState(1);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (Array.isArray(colors)) {
            selectColor(colors[0].id)
        }
    }, [colors]);

    const onClose = () => {
        setViseblePopup(false);
        setInputValue("");
        selectColor(colors[0].id);
    };

    const addList = () => {
        if (!inputValue) {
            alert("Введите название");
            return;
        }
        const color = colors.filter(c => c.id === selectedColor)[0];
        onAddList(inputValue, color);
        onClose();
    };

    return (
        <div className='add-list'>
            <List
                onClick={() => setViseblePopup(!visiblePopup)}
                items={[
                    {
                        className: "list__add-button",
                        icon: <FontAwesomeIcon icon={faPlus}/>,
                        name: "Добавить список"
                    }
                ]}
            />
            {visiblePopup && (
                <div className='add-list__popup'>
                    <div onClick={onClose} className='add-list__popup-close-btn'>
                        <FontAwesomeIcon icon={faTimesCircle}/>
                    </div>
                    <input
                        onChange={e => setInputValue(e.target.value)}
                        value={inputValue}
                        type='text'
                        placeholder='Название списка'
                        className='field field-w100'
                    />
                    <div className='add-list__popup-colors'>
                        {colors.map(color => (
                            <Badge
                                onClick={() => selectColor(color.id)}
                                key={color.id}
                                color={color}
                                className={selectedColor === color.id && "active"}
                            />
                        ))}
                    </div>
                    <button onClick={addList} className='button'>
                        Добавить
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddList;
