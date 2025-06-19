import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../../../Auxiliary/ButtonEx.tsx";
import {useStoreBook} from "../../../Stores/storeBook.ts";
import {useStoreState} from "../../../Stores/storeAux.ts";
import {Col, Row, SwitchButton, Text} from "../../Auxiliary.tsx";
import {IScene} from "../../../types.ts";
import {generateUID as getUID} from "../../../../../lib/utils.ts";
import Group from "../../../../Auxiliary/Group.tsx";
import EventItem from "./EventItem.tsx";

interface IEventsProps {
    iPart: number;
    iChapter: number;
    iScene: number;
    scene: IScene;
}

const Events = ({iPart, iChapter, iScene, scene}: IEventsProps) => {
    const {id, aim, arrItemID, arrCharacterID, arrEvent} = scene;

    const {isState} = useStoreState();
    const addEvent = useStoreBook(state => state.addEvent);

    const deleteEvent = useStoreBook(state => state.deleteEvent);

    const setSubEvent = (iEvent: number, key: string, value: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {
        ...arrEvent[iEvent], [key]: value
    })

    const updateSubEvent = (iEvent: number, subEvent: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {...arrEvent[iEvent], ...subEvent})
    return <Col role="events" className="" noBorder={true}>
        <Row role="menu-items">
            <Group>
                <SwitchButton id={id + 'sa'}/>
                <ButtonEx className="bi-lightning-charge-fill" title="Добавить действие"
                          onClick={() => addEvent(iPart, iChapter, iScene,
                              {arrChangeProp: [], desc: '', id: getUID(), manner: '', objectID: '', subjectID: '', type: 'action'}
                          )}/>
                <ButtonEx className="bi-chat-square-fill" title="Добавить реплику"
                          onClick={() => addEvent(iPart, iChapter, iScene,
                              {arrChangeProp: [], desc: '', id: getUID(), manner: '', objectID: '', subjectID: '', type: 'replica'}
                          )}/>
            </Group>
            <Text>События</Text>
        </Row>
        {!isState(id + 'sa') && arrEvent.length > 0 && <Col noBorder={true} className="ml-4">
            {arrEvent.map(({type}, iEvent) =>
                <Row key={iEvent}>
                    <EventItem iPart={iPart} iChapter={iChapter} iScene={iScene} iEvent={iEvent} arrEvent={arrEvent}/>
                </Row>)}
        </Col>}
    </Col>
};

export default memo(Events);