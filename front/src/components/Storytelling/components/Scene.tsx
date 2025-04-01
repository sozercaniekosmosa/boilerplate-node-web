import React from "react";
import {Button} from "react-bootstrap";
import ButtonEx from "../../ButtonEx/ButtonEx.tsx";
import {clButton, PARTS, stButton} from "../Storytelling.tsx";
import TextBlock from "./TextBlock.tsx";
import Select from "../../Select/Select.tsx";
import styled from "styled-components";

const SwitchFolder = styled(Button).attrs<{ $hide?: boolean; }>(props => ({
    className: `btn-secondary bi-${props?.$hide ? 'plus-' : ''}square btn btn-sm flex-grow-0 d-flex justify-content-center align-items-center`
}))`width: 1.8em;
    height: 1.8em;`

const BtnEx = styled(ButtonEx).attrs<{ $variant?: string; }>(props => ({
    className: `${props?.$variant} btn-sm flex-grow-0`
}))`width: 1.8em;
    height: 1.8em;`

const SelectScene = styled(Select).attrs({
    className: 'ps-2 pe-5 py-0 w-auto'
})`
    height: 1.7em;
    font-size: 1.2em;
    line-height: 1.1;
`

const Scene = ({book, setBook, param}) => {
    const {worlds, scenes, characters, objects} = book;
    const {parent, list, index, child} = param;
    const opt = list.data.opt;

    return <>
        <div className="d-flex flex-row gap-1 mb-1">
            <SwitchFolder $hide={list.hide} onClick={() => (list.hide = !list.hide, setBook({...book}))}/>

            <BtnEx $variant="btn-danger bi-x-lg" description="Удалить" onConfirm={() => {
                parent.arrChild.splice(index, 1);
                setBook({...book})
            }}/>
            <BtnEx $variant={"btn-secondary bi-person-add"} onClick={() => {
                list.arrChild.push({arrChild: [], data: {opt: PARTS.CHARACTER}, hide: false});
                setBook({...book})
            }}/>
            <BtnEx $variant={"btn-secondary bi-box"} onClick={() => {
                list.arrChild.push({arrChild: [], data: {opt: PARTS.OBJECT}, hide: false});
                setBook({...book})
            }}/>
            <BtnEx $variant={"btn-secondary bi-activity"} onClick={() => {
                list.arrChild.push({arrChild: [], data: {opt: PARTS.ACTION}, hide: false});
                setBook({...book})
            }}/>
            <div className="align-content-center">{opt}</div>
            <BtnEx $variant={`btn-secondary bi-box-arrow-in-down-right`} onClick={() => {
            }}/>
            <SelectScene arrList={Object.keys(scenes)} value={list.data.scene} onChange={(key) => (list.data.scene = key, setBook({...book}))}/>
        </div>
        <div>
            {list.data?.scene && Object.entries(scenes[list.data.scene]).map((scene, idi) => {
                const [sceneParam, text] = scene;
                // @ts-ignore
                return <div key={idi}>{text.text}</div>
            })}
        </div>
        {!list.hide && <div className="flex-column border rounded p-1 mb-1">{child}</div>}
    </>
};

export default Scene;