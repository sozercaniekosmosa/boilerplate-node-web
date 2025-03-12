import {Button, ButtonGroup} from "react-bootstrap";
import React, {useState} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../ButtonEx/ButtonEx.tsx";
import NestedList from "./components/NestedList.tsx";

const Storytelling: React.FC<any> = () => {

    const [book, setBook] = useState({
        arr: [
            {
                arr: [
                    {
                        arr: [],
                        data: {name: 'Child 1', value: 42}
                    }
                ],
                data: {name: 'Parent 1', id: 1}
            },
            {
                arr: [],
                data: {name: 'Parent 2', id: 2}
            }
        ],
        data: {root: true}
    });

    return <NestedList obj={book} onInsert={(parent, item, index) => {
        return <ButtonGroup className="flex-row pb-1">
            {JSON.stringify(item.data)}
            <Button className="btn btn-sm btn-secondary bi-plus-circle flex-grow-0"
                    onClick={() => {

                        item.arr.push({
                            arr: [],
                            data: 'child'
                        })

                        setBook({...book})

                    }}/>
            <ButtonEx className="btn btn-sm btn-danger bi-x-lg flex-grow-0" onConfirm={() => {
                parent.arr.splice(index, 1)
                setBook({...book})
            }} description="Удалить"/>
        </ButtonGroup>
    }}/>
};

export default Storytelling;