import {Button, ButtonGroup} from "react-bootstrap";
import React, {useState} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../ButtonEx/ButtonEx.tsx";
import NestedList from "./components/NestedList.tsx";

const Storytelling: React.FC<any> = () => {

    const [book, setBook] = useState({
        arr: [
            {
                arr: [],
                data: {name: 'Parent 1', id: 1},
                hide: true
            },
            {
                arr: [],
                data: {name: 'Parent 2', id: 2},
                hide: true
            }
        ],
        data: {root: true},
        hide: true
    });

    const stButton = {width: '1.8em', height: '1.8em'}
    const clButton = ' btn btn-sm flex-grow-0 d-flex justify-content-center align-items-center'

    return <NestedList obj={book} onInsert={(parent, item, index, child) => {
        const {data, hide, arr} = item;
        return <div className="d-flex flex-column m-1">
            <div className="d-flex flex-row gap-1 mb-1">
                <Button style={stButton} className={`btn-secondary bi-${item.hide ? 'plus-' : ''}square` + clButton} onClick={() => {
                    item.hide = !item.hide;
                    setBook({...book})
                }}/>
                <Button style={stButton} className={"btn-secondary bi-plus-circle" + clButton} onClick={() => {
                    arr.push({arr: [], data: 'child', hide: true});
                    setBook({...book})
                }}/>
                <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить" onConfirm={() => {
                    parent.arr.splice(index, 1);
                    setBook({...book});
                }}/>
            </div>
            {!item.hide && <div className="flex-column border rounded p-1">
                {child}
            </div>}
        </div>
    }}/>
};

export default Storytelling;