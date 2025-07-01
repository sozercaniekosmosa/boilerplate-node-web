import React, {useCallback, useEffect, useRef} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../Auxiliary/ButtonEx.tsx";
import clsx from "clsx";
import {useStoreState} from "../Stores/storeAux.ts";
import {IEvent, IPath, TProp} from "../types.ts";
import {useStoreGenCharacter, useStoreGenItem, useStoreGenScene} from "../Stores/storeGenerators.ts";
import {useStoreBook} from "../Stores/storeBook.ts";
import DropdownButton from "../../Auxiliary/DropdownButton.tsx";


export const Text = ({children = null, className = ''}) => <div className={clsx(
    "select-none text-black/60 content-center", className)
}>{children}</div>;

interface IComponentCol extends React.HTMLAttributes<HTMLDivElement> {
    noBorder?: boolean;
}

interface IComponentRow extends React.HTMLAttributes<HTMLDivElement> {
}

export const Col = ({children, className = '', noBorder = false, role = '', ...rest}: IComponentCol) => <div
    role={role}
    className={clsx(
        className,
        "flex flex-col ",
        noBorder ? "" : "border border-black/20 rounded p-1",
        "gap-1"
    )} {...rest}>{children}</div>;

export const Row = ({children, className = '', role = '', ...rest}: IComponentRow) => {
    return <div role={role} className={clsx(className, "flex flex-row gap-1")} {...rest}>{children}</div>;
}

export const SwitchButton =
    ({id, on = 'bi-caret-down-square', off = 'bi-caret-right-square', title = null, children = null, className = ''}) =>
        <ButtonEx
            title={title}
            className={clsx(useStoreState.getState().isState(id) ? off : on, className)}
            onClick={() => useStoreState.getState().switchState(id)} children={children}/>

export const ButtonDelete = ({onDelete, className = '', icon = 'bi-x-lg'}) => <ButtonEx
    className={clsx("flex-grow-0 st-danger", className, icon)}
    description="Удалить"
    onConfirm={onDelete}/>

export const TextInput =
    ({value, placeholder, onChange, className = ''}) => {
        return <input type="text" value={value} placeholder={placeholder}
                      role="text-input"
                      className={clsx("px-2 w-full",
                          'focus:bg-inherit st-focus st-air-tx',
                          "rounded-sm",
                          "st-air-hover",
                          className
                      )}
                      onChange={onChange}/>;
    }

interface ISelectItemProp {
    path: IPath;
    id: string;
    nameField?: string;
    arrDisplayed?: {
        scene?: boolean;
        character?: boolean;
        item?: boolean;
    },
    label?: string;
    update?: (iEvent: number, id: string, type?: TProp) => void;
}

export const SelectItem = (
    {path, id, label = 'Не выбрано', arrDisplayed = {character: true, scene: true, item: true}, update}: ISelectItemProp
) => {

    const arrPart = useStoreBook(state => state.arrPart);

    const arrGenScene = useStoreGenScene(state => state.arrGen);
    const listIDScene = useStoreGenScene(state => state.listID);
    const arrGenCharacter = useStoreGenCharacter(state => state.arrGen);
    const listIDCharacter = useStoreGenCharacter(state => state.listID);
    const arrGenItem = useStoreGenItem(state => state.arrGen);
    const listIDItem = useStoreGenItem(state => state.listID);

    const scene = arrPart[path.iPart].arrChapter[path.iPart].arrScene[path.iScene];

    const getObjectByID = (id: string) => {
        var _u = undefined;
        if (listIDScene?.[id] != _u) {
            return {type: 'scene', item: arrGenScene[listIDScene[id]]};
        } else {
            if (listIDCharacter?.[id] != _u) {
                return {type: 'character', item: arrGenCharacter[listIDCharacter[id]]};
            } else {
                if (listIDItem?.[id] != _u) {
                    return {type: 'item', item: arrGenItem[listIDItem[id]]};
                } else {
                    return null;
                }
            }
        }
    }

    const arrCharacterID = scene.arrCharacterID;
    const arrItemID = scene.arrItemID;

    let listScene: React.JSX.Element[], listCharacter: React.JSX.Element[], listItem: React.JSX.Element[];

    if (arrDisplayed.scene)
        listScene = arrGenScene.map(({id, name}, i) => <div key={i} data-id={id} data-type="scene">{name}</div>);
    if (arrDisplayed.character)
        listCharacter = arrGenCharacter.map(({id, name}, i) => arrCharacterID.includes(id) || arrItemID.includes(id) ?
            <div key={i} data-id={id} data-type="character">{name}</div> : null).filter(it => it);
    if (arrDisplayed.item)
        listItem = arrGenItem.map(({id, name}, i) => arrItemID.includes(id) || arrItemID.includes(id) ?
            <div key={i} data-id={id} data-type="item">{name}</div> : null).filter(it => it);

    const obj = getObjectByID(id);
    const name = obj?.item.name ?? label;
    const icon = obj?.type == 'scene' ? 'bi-image' : obj?.type == 'character' ? 'bi-person-fill' : obj?.type == 'item' ? 'bi-box' : '';

    return <DropdownButton title={name} className={clsx(icon, 'gap-1')}>
        <Row className={
            clsx("*:cursor-pointer max-w-[75vw] max-h-[33vh]",
                "rounded-sm shadow-xl/20",
                "bg-white ring-1 ring-gray-500/50 !gap-0",
            )
        }
             onClick={({target}: any) => {
                 update(path.iEvent, target.dataset.id, target.dataset.type);
             }}>
            {listScene?.length > 0 && <Col noBorder={true} className="flex-1/3">
                <div className="text-center p-1 pointer-events-none border-b border-r border-gray-200 bi-image"/>
                <Col className="overflow-auto h-inherit *:text-center *:px-1 *:py-1 *:hover:bg-gray-500/50 !gap-0"
                     noBorder={true}>
                    {listScene}
                </Col>
            </Col>}
            {listCharacter?.length > 0 && <Col noBorder={true} className="flex-1/3">
                <div className="text-center p-1 pointer-events-none border-b border-r border-gray-200 bi-person-fill"/>
                <Col className="overflow-auto h-inherit *:text-center *:px-1 *:py-1 *:hover:bg-gray-500/50 !gap-0"
                     noBorder={true}>
                    {listCharacter}
                </Col>
            </Col>}
            {listItem?.length > 0 && <Col noBorder={true} className="flex-1/3">
                <div className="text-center p-1 pointer-events-none border-b border-gray-200 bi-box"/>
                <Col className="overflow-auto h-inherit *:text-center *:px-1 *:py-1 *:hover:bg-gray-500/50 !gap-0"
                     noBorder={true}>
                    {listItem}
                </Col>
            </Col>}
        </Row>
    </DropdownButton>;
}

export const SelectCharacters = ({path, id, nameField}: ISelectItemProp) => {

    const arrPart = useStoreBook(state => state.arrPart);
    const arrGenCharacter = useStoreGenCharacter(state => state.arrGen);
    const listIDCharacter = useStoreGenCharacter(state => state.listID);
    const arrGenItem = useStoreGenItem(state => state.arrGen);
    const listIDItem = useStoreGenItem(state => state.listID);

    const scene = arrPart[path.iPart].arrChapter[path.iPart].arrScene[path.iScene];

    const updateSubEvent = (iEvent: number, subEvent: any) => useStoreBook.getState().updateEvent(path.iPart, path.iChapter, path.iScene, path.iEvent, {...event, ...subEvent})

    const getByID = (id: string) => {
        var _u = undefined;
        return listIDCharacter?.[id] != _u ? arrGenCharacter[listIDCharacter[id]] : listIDItem?.[id] != _u ? arrGenItem[listIDItem[id]] : null;
    }

    return <DropdownButton title={getByID(id)?.name ?? "subject"} className={clsx("h-full", 'bi-person-fill')}>
        <div className={
            clsx(
                "py-3 *:hover:bg-gray-500/50 *:px-3 *:p-1",
                "*:cursor-pointer w-80",
                "rounded-sm shadow-xl/20",
                "bg-white ring-1 ring-gray-500/50 !gap-0",
            )
        }
             onClick={({target}: any) => updateSubEvent(path.iEvent, {[nameField + 'ID']: target.dataset.id} as IEvent)}>
            {arrGenCharacter.map(({id, name}, i) => scene.arrCharacterID.includes(id) ?
                <div key={i} data-id={id}>{name}</div> : null)}
        </div>
    </DropdownButton>;
}

export function ChangeFontSize({id, ...rest}) {
    const {listState, setState} = useStoreState();
    const refNodeParent = useRef<HTMLElement>();
    useEffect(() => {
        refNodeParent.current = document.getElementById(id);
        refNodeParent.current.classList.add("transition-all");
        refNodeParent.current.style.fontSize = ((listState[id] || 1)) + 'em';
    }, []);

    // const setFontSize = useCallback((val: number) => {
    const setFontSize = (val: number) => {
        setState(id, Math.trunc(val * 1000) / 1000);
        refNodeParent.current.style.fontSize = val + 'em';
    }
    // }, []);

    return <Row style={{fontSize: '14px', lineHeight: '14px'}} {...rest}>
        <ButtonEx className={"bi-fonts"}
                  onClick={({ctrlKey}) => setFontSize((listState[id] || 1) + 0.025 * (ctrlKey ? 10 : 1))}>+</ButtonEx>
        <ButtonEx className={"bi-fonts"}
                  onClick={({ctrlKey}) => setFontSize((listState[id] || 1) - 0.025 * (ctrlKey ? 10 : 1))}>-</ButtonEx>
        <ButtonEx className={"bi-arrow-counterclockwise"}
                  onClick={() => setFontSize(1)}/>
    </Row>;
}