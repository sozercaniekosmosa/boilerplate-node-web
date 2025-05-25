import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../../../Auxiliary/ButtonEx.tsx";
import clsx from "clsx";
import {useStoreBook} from "../../../Stores/storeBook.ts";
import {useStoreFolding} from "../../../Stores/storeAux.ts";
import {ButtonDelete, Col, Row, SwitchHide, Text, TextInput} from "../../Auxiliary.tsx";
import DropdownButton from "../../../../Auxiliary/DropdownButton.tsx";
import {IAction, IChangeProperties, IReplica, IScene, TEvent} from "../../../types.ts";
import {generateUID as getID} from "../../../../../lib/utils.ts";
import Group from "../../../../Auxiliary/Group.tsx";
import TextWrite from "../../../../Auxiliary/TextWrite.tsx";
import Replica from "./Replica.tsx";
import ChangeProp from "./ChangeProp.tsx";
import Action from "./Action.tsx";

interface IEventsProps {
    iPart: number;
    iChapter: number;
    iScene: number;
    scene: IScene;
}

const Events = ({iPart, iChapter, iScene, scene}: IEventsProps) => {
    const {id, aim, arrItem, arrCharacter, arrEvent} = scene;

    const {isHide} = useStoreFolding();
    const addAction = useStoreBook(state => state.addEvent);

    const deleteEvent = useStoreBook(state => state.deleteEvent);

    const setSubEvent = (iEvent: number, key: string, value: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {
        ...arrEvent[iEvent], [key]: value
    })

    const updateSubEvent = (iEvent: number, subEvent: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {...arrEvent[iEvent], ...subEvent})
    return <Col role="events" className="" noBorder={true}>
        <Row role="menu-items">
            <Group>
                <SwitchHide id={id + 'sa'}/>
                <ButtonEx className="bi-lightning-charge-fill" title="Добавить действие"
                          onClick={() => addAction(iPart, iChapter, iScene, {
                              id: getID(), type: 'action', object: '', subject: '',
                              desc: '',
                          })}/>
                <ButtonEx className="bi-chat-left-fill" title="Добавить реплику"
                          onClick={() => addAction(iPart, iChapter, iScene, {
                              id: getID(), type: 'replica', object: '', subject: '',
                              text: '', manner: '',
                          })}/>
                <ButtonEx className="bi-list-task" title="Добавить изменение свойства"
                          onClick={() => addAction(iPart, iChapter, iScene, {
                              id: getID(), type: 'change-prop', object: '', subject: '',
                              key: '', value: '',
                          })}/>
            </Group>
            <Text>События</Text>
        </Row>
        {!isHide(id + 'sa') && arrEvent.length > 0 && <Col noBorder={true} className="ml-4">
            {arrEvent.map(({type}, iEvent) =>
                <Row key={iEvent}>
                    {type == 'replica' && <Replica iPart={iPart} iChapter={iChapter} iScene={iScene} iEvent={iEvent}
                                                   arrEvent={arrEvent}/>}
                    {type == 'change-prop' &&
                        <ChangeProp iPart={iPart} iChapter={iChapter} iScene={iScene} iEvent={iEvent}
                                    arrEvent={arrEvent}/>}
                    {type == 'action' &&
                        <Action iPart={iPart} iChapter={iChapter} iScene={iScene} iEvent={iEvent} arrEvent={arrEvent}/>}
                </Row>)}
        </Col>}
    </Col>
};

export default memo(Events);