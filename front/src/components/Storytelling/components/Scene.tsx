import React from "react";
import {Button} from "react-bootstrap";
import ButtonEx from "../../ButtonEx/ButtonEx.tsx";
import {clButton, PARTS, stButton} from "../Storytelling.tsx";
import TextBlock from "./TextBlock.tsx";

const Scene = ({book, setBook, param}) => {
    const {parent, list, index, child} = param;
    const opt = list.data.opt;

    const DESC_PLACE = `
    — Географическое расположение (город, природа, помещение).
    — Конкретные детали (комната, улица, природный объект).
    — Детали окружения (интерьер, пейзаж, архитектура).
    — Социальная обстановка (богатый квартал, трущобы, замок).
    — Климатические условия (погода, время года, освещение).
    `

    return <>
        <div className="d-flex flex-row gap-1 mb-1">
            <Button style={stButton} className={`btn-secondary bi-${list.hide ? 'plus-' : ''}square` + clButton} onClick={() => {
                list.hide = !list.hide;
                setBook({...book})
            }}/>
            <ButtonEx style={stButton} className="btn-danger btn-sm bi-x-lg flex-grow-0" description="Удалить" onConfirm={() => {
                parent.arrChild.splice(index, 1);
                setBook({...book});
            }}/>
            <Button style={stButton} className={"btn-secondary bi-person-add" + clButton} onClick={() => {
                list.arrChild.push({arrChild: [], data: {opt: PARTS.CHARACTER}, hide: false});
                setBook({...book})
            }}/>
            <Button style={stButton} className={"btn-secondary bi-box" + clButton} onClick={() => {
                list.arrChild.push({arrChild: [], data: {opt: PARTS.OBJECT}, hide: false});
                setBook({...book})
            }}/>
            <Button style={stButton} className={"btn-secondary bi-activity" + clButton} onClick={() => {
                list.arrChild.push({arrChild: [], data: {opt: PARTS.ACTION}, hide: false});
                setBook({...book})
            }}/>
            <div className="align-content-center">{opt}</div>
            <Button style={stButton} className={`btn-secondary bi-box-arrow-in-down-right` + clButton} onClick={() => {
                list.hide = !list.hide;
                setBook({...book})
            }}/>
        </div>

        <TextBlock className={'flex-stretch no-resize border rounded mb-1 p-2 ' + (list.data.sceneDesc.pointOfView.length ? '' : 'border-danger')}
                   value={list.data.sceneDesc.pointOfView || ''}
                   onChange={({target}) => (list.data.sceneDesc.pointOfView = target.value, setBook({...book}))} placeholder={DESC_PLACE}
                   description="Место действия" style={{fontSize: '1em'}}/>
        {!list.hide && <div className="flex-column border rounded p-1 mb-1">{child}</div>}
    </>
};

export default Scene;