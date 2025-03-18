import {Button, ButtonGroup} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../ButtonEx/ButtonEx.tsx";
import NestedList from "./components/NestedList.tsx";
import Select from "../Select/Select.tsx";
import Scene from "./components/Scene.tsx";

export const stButton = {width: '1.8em', height: '1.8em'}
export const clButton = ' btn btn-sm flex-grow-0 d-flex justify-content-center align-items-center'

const EMPTY = 'Пусто';
const ROOT = 'Содержание';
const INTRO = 'Вступление';
const MID = 'Основная часть';
const END = 'Заключение';
const CHAPTER = 'Глава';
const SCENE = 'Сцена';
const CHARACTER = 'Персонаж';
const OBJECT = 'Объект';
const ACTION = 'Действие';

export const PARTS = {EMPTY, ROOT, INTRO, MID, END, CHAPTER, SCENE, CHARACTER, OBJECT, ACTION,};
const arrControl = [EMPTY, CHARACTER, OBJECT, ACTION];

let book = {
    world: {},
    palace: {},
    character: {},
    object: {},
    content: {
        arrChild: [
            {
                arrChild: [],
                data: {opt: INTRO},
                hide: false
            },
            {
                arrChild: [],
                data: {opt: MID},
                hide: false
            },
            {
                arrChild: [],
                data: {opt: END},
                hide: false
            },
        ],
        data: {opt: ROOT},
        hide: true
    }
};

const Base = ({book, setBook, param}) => {
    const {parent, list, index, child} = param;
    const {opt} = list.data
    return <>
        <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить" onConfirm={() => {
            parent.arrChild.splice(index, 1);
            setBook({...book});
        }}/>
        <Select arrList={arrControl} value={opt} onChange={(key) => (list.data.opt = key, setBook({...book}))}
                style={{height: '1.7em', fontSize: '1.2em', lineHeight: 1.1}} className="ps-2 pe-5 py-0 w-auto"/>
    </>
};

const Control = ({book, setBook, param}) => {
    const {parent, list, index, child} = param;
    const opt = list.data.opt;

    if (opt == ROOT) {
        return <>
            <div className="d-flex flex-row gap-1 mb-1">
                <Select arrList={['Шаблон - 1']} value={opt} onChange={(key) => (list.data.opt = key, setBook({...book}))}
                        style={{height: '1.7em', fontSize: '1.2em', lineHeight: 1.1}} className="flex-grow-0 ps-2 pe-5 py-0 w-auto mb-1"/>
            </div>
            <div className="flex-column border rounded p-1">{child}</div>
        </>
    } else if ((opt == INTRO) || (opt == MID) || (opt == END)) {
        return <>
            <div className="d-flex flex-row gap-1 mb-1">
                <Button style={stButton} className={`btn-secondary bi-${list.hide ? 'plus-' : ''}square` + clButton} onClick={() => {
                    list.hide = !list.hide;
                    setBook({...book})
                }}/>
                <Button style={stButton} className={"btn-secondary bi-plus-circle" + clButton} onClick={() => {
                    list.arrChild.push({arrChild: [], data: {opt: CHAPTER}, hide: false});
                    setBook({...book})
                }}/>
                <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить" onConfirm={() => {
                    parent.arrChild.splice(index, 1);
                    setBook({...book});
                }}/>
                <div className="align-content-center">{opt}</div>
            </div>
            {!list.hide && <div className="flex-column border rounded p-1">{child}</div>}
        </>
    } else if (opt == CHAPTER) {
        return <>
            <div className="d-flex flex-row gap-1 mb-1">
                <Button style={stButton} className={`btn-secondary bi-${list.hide ? 'plus-' : ''}square` + clButton} onClick={() => {
                    list.hide = !list.hide;
                    setBook({...book})
                }}/>
                <Button style={stButton} className={"btn-secondary bi-plus-circle" + clButton} onClick={() => {
                    list.arrChild.push({
                        arrChild: [], data: {
                            opt: SCENE, scene: null, sceneDesc: {
                                pointOfView: '',
                                location: '',
                                detailsEnv: '',
                                time: '',
                                mood: '',
                                sensores: '',
                                symbols: '',
                            }
                        }, hide: false
                    });
                    setBook({...book})
                }}/>
                <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить" onConfirm={() => {
                    parent.arrChild.splice(index, 1);
                    setBook({...book});
                }}/>
                <div className="align-content-center">{opt}</div>
            </div>
            {!list.hide && <div className="flex-column border rounded p-1">{child}</div>}
        </>
    } else if (opt == SCENE) {
        // list.data.
        return <Scene book={book} setBook={setBook} param={param}/>
    } else if (opt == CHARACTER) {
        return <div className="d-flex flex-row gap-1 mb-1">
            <Base book={book} setBook={setBook} param={param}/>
        </div>
    } else if (opt == OBJECT) {
        return <div className="d-flex flex-row gap-1 mb-1">
            <Base book={book} setBook={setBook} param={param}/>
        </div>
    } else if (opt == ACTION) {
        return <div className="d-flex flex-row gap-1 mb-1">
            <Base book={book} setBook={setBook} param={param}/>
        </div>
    } else if (opt == EMPTY) {
        return <div className="d-flex flex-row gap-1 mb-1">
            <Base book={book} setBook={setBook} param={param}/>
        </div>
    } else {
        return <div className="d-flex flex-row gap-1 mb-1">
            <div className="bg-warning">Не существует такого элемента</div>
            <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить" onConfirm={() => {
                parent.arrChild.splice(index, 1);
                setBook({...book});
            }}/>
        </div>
    }
}

const Storytelling: React.FC<any> = () => {

    const [content, setContent] = useState(book.content);
    // @ts-ignore
    window.content = content;
    return <NestedList list={content} onInsert={param => {
        const {parent, list, index, child} = param;
        return <div className="d-flex flex-column m-1">
            <Control book={content} setBook={setContent} param={param}/>
        </div>
    }}/>
};

export default Storytelling;