import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {useStoreBook} from "../../../Stores/storeBook.ts";
import {ButtonDelete, Col, Row, SelectItem, TextInput} from "../../Auxiliary.tsx";
import {IChangeProperties, IEvent, IMapProp, IPath, TProp} from "../../../types.ts";
import {useStoreGenCharacter, useStoreGenItem, useStoreGenScene} from "../../../Stores/storeGenerators.ts";
import clsx from "clsx";
import TextWrite from "../../../../Auxiliary/TextWrite.tsx";
import DropdownButton from "../../../../Auxiliary/DropdownButton.tsx";
import ButtonEx from "../../../../Auxiliary/ButtonEx.tsx";
import {Tooltip} from "../../../../Auxiliary/Tooltip.tsx";

interface IEventsProps {
    iPart: number;
    iChapter: number;
    iScene: number;
    iEvent: number;
    arrEvent: IEvent[];
}

const EventItem = ({iPart, iChapter, iScene, iEvent, arrEvent}: IEventsProps) => {

    const event: IEvent = arrEvent[iEvent];
    const {arrChangeProp, id, manner, objectID, subjectID, desc, type} = event;

    const deleteEvent = useStoreBook(state => state.deleteEvent);
    const updateSubEvent = (iEvent: number, subEvent: any) => {
        useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {...arrEvent[iEvent], ...subEvent});
    }

    const arrPart = useStoreBook(state => state.arrPart);

    const addChangeProp = useStoreBook(state => state.addChangeProp);
    const updateChangeProp = useStoreBook(state => state.updateChangeProp);
    const deleteChangeProp = useStoreBook(state => state.deleteChangeProp);
    const listID = useStoreBook(state => state.listID);
    const getItemByID = useStoreBook(state => state.getItemByID);
    const listChangeProp = useStoreBook(state => state.listChangeProp);


    const arrGenScene = useStoreGenScene(state => state.arrGen);
    const listIDScene = useStoreGenScene(state => state.listID);
    const updateGenSceneProp = useStoreGenScene((state) => state.updateGenProp);

    const arrGenCharacter = useStoreGenCharacter(state => state.arrGen);
    const listIDCharacter = useStoreGenCharacter(state => state.listID);
    const updateGenCharacterProp = useStoreGenCharacter((state) => state.updateGenProp);

    const arrGenItem = useStoreGenItem(state => state.arrGen);
    const listIDItem = useStoreGenItem(state => state.listID);
    const updateGenItemProp = useStoreGenCharacter((state) => state.updateGenProp);


    let path = {iPart, iChapter, iScene, iEvent} as IPath

    const listIconType = {
        action: {
            icon: 'bi-lightning-charge-fill',
            manner: 'Манера действия',
            desc: 'Описание действия'
        },
        replica: {
            icon: 'bi-chat-square-fill',
            manner: 'Манера/тон произношения',
            desc: 'Текст реплики'
        }
    }

    const getObjectByID = (id: string) => {
        var _u = undefined;
        if (listIDScene?.[id] != _u) {
            return arrGenScene[listIDScene[id]];
        } else {
            if (listIDCharacter?.[id] != _u) {
                return arrGenCharacter[listIDCharacter[id]];
            } else {
                if (listIDItem?.[id] != _u) {
                    return arrGenItem[listIDItem[id]];
                } else {
                    return null;
                }
            }
        }
    }

    const getPropByID = (id: string) => {
        var _u = undefined;
        if (listIDScene?.[id] != _u) {
            const [i, j] = listIDScene[id];
            return arrGenScene[i].arrMapProp[j];
        } else {
            if (listIDCharacter?.[id] != _u) {
                const [i, j] = listIDCharacter[id]
                return arrGenCharacter[i].arrMapProp[j];
            } else {
                if (listIDItem?.[id] != _u) {
                    const [i, j] = listIDItem[id];
                    return arrGenItem[i].arrMapProp[j];
                } else {
                    return null;
                }
            }
        }
    }

    return <Col className="grow bg-white relative">
        <Row className="grow">
            {/*<Group>*/}
            <DropdownButton role="change-type" title="" className={clsx("h-full ", listIconType[type].icon)}>
                <div className={clsx(
                    'overflow-auto h-auto',
                    'py-3 *:hover:bg-gray-500/50 *:px-3 *:p-1',
                    "*:cursor-pointer w-auto",
                    "rounded-sm shadow-xl/20",
                    "bg-white ring-1 ring-gray-500/50 !gap-0",
                    "st-air-tx"
                )}
                     onClick={({target}: any) => {
                         updateSubEvent(iEvent, {type: target.dataset.type})
                     }}>
                    <div data-type="action" className={clsx('bi-lightning-charge-fill')}/>
                    <div data-type="replica" className={clsx('bi-chat-square-fill')}/>
                </div>
            </DropdownButton>
            <ButtonEx className={clsx('bi-plus-circle')} title="Добавить модификатор свойств"
                      onClick={() => addChangeProp(iPart, iChapter, iScene, iEvent)}/>
            <SelectItem path={path} id={objectID} update={(iEvent, id) => updateSubEvent(iEvent, {objectID: id})}/>
            <SelectItem path={path} id={subjectID} update={(iEvent, id) => updateSubEvent(iEvent, {subjectID: id})}
                        arrDisplayed={{character: true}}/>
            {/*</Group>*/}
            <TextInput value={manner} placeholder={listIconType[type].manner} className="st-air-tx-imp"
                       onChange={({target}) => updateSubEvent(iEvent, {manner: target.value,})}/>
            <ButtonDelete onDelete={() => deleteEvent(iPart, iChapter, iScene, iEvent)}/>
        </Row>
        <TextWrite value={desc} placeholder={listIconType[type].desc} fitToTextSize={true}
                   className="w-full grow *:border-none *:rounded-sm st-air-tx-imp"
                   onChange={({target}) => updateSubEvent(iEvent, {desc: target.value,})}/>
        {arrChangeProp.map((prop, iProp) => {
            const {id: idChangeProp, order, targetID, propID, value, type} = prop;
            const changedValue = value;
            let beforeValue: string;
            let baseValue: string;
            let resultValue = value;

            if (targetID && propID && listChangeProp?.[targetID]) {

                const arrChangeProp = listChangeProp[targetID]
                    .map(id => getItemByID(id))
                    .filter(changeProp =>
                        changeProp?.order < order &&
                        changeProp.propID === propID
                    )

                beforeValue = (arrChangeProp.length) ? arrChangeProp?.['at'](-1).value : undefined;
                baseValue = getPropByID(propID).value;

                if (!resultValue) {
                    resultValue = arrChangeProp.length ? beforeValue : baseValue;
                }
            }

            return <Col role="change-prop" className="grow bg-white" key={iProp}>
                <Row>
                    <Row className="w-full">
                        <Tooltip text="Модификатор свойства">
                            <div
                                className={clsx('bi-list-task', 'relative', 'flex justify-center items-center', 'h-fit p-1', 'st-air',)}/>
                        </Tooltip>
                        <SelectItem path={path} id={targetID} label="Объект"
                                    update={(iEvent: number, id: string, type: TProp) => {
                                        updateChangeProp(iPart, iChapter, iScene, iEvent, iProp, {
                                            targetID: id,
                                            value: '',
                                            type
                                        });
                                    }} arrDisplayed={{scene: true, character: true, item: true}}/>
                        <DropdownButton title={getPropByID(propID)?.title ?? 'Свойство'} className={clsx("h-full")}>
                            <div className={clsx(
                                'overflow-auto max-h-[33vh]',
                                "py-3 *:hover:bg-gray-500/50 *:px-3 *:p-1",
                                "*:cursor-pointer w-80",
                                "rounded-sm shadow-xl/20",
                                "bg-white ring-1 ring-gray-500/50 !gap-0",
                            )}
                                 onClick={(e: any) => {
                                     const _propID = e.target.dataset.id
                                     if (!_propID) return;
                                     // const value = getPropByID(_propID).value;
                                     updateChangeProp(iPart, iChapter, iScene, iEvent, iProp, {
                                         propID: _propID,
                                         value: ''
                                     })
                                 }}>
                                {getObjectByID(targetID)?.arrMapProp.map(({
                                                                              id,
                                                                              title,
                                                                              isChange,
                                                                          }: IMapProp, i: number) => title &&
                                    <div key={i} data-id={id}>{title}</div>)}
                            </div>
                        </DropdownButton>
                    </Row>
                    <ButtonDelete onDelete={() => {
                        // debugger;
                        deleteChangeProp(iPart, iChapter, iScene, iEvent, iProp);
                    }}/>
                </Row>
                <TextWrite value={resultValue} placeholder="Значение свойства" fitToTextSize={true}
                           className={
                               clsx(
                                   "w-full grow *:border-none *:rounded-sm st-air-tx-imp",
                                   !changedValue || changedValue == beforeValue || changedValue != '' && resultValue == baseValue ? "ring-3 ring-orange-400" : "",
                               )
                           }
                           onChange={({target}) => updateChangeProp(iPart, iChapter, iScene, iEvent, iProp, {value: target.value})}
                />
            </Col>
        })}
    </Col>
};

export default memo(EventItem);