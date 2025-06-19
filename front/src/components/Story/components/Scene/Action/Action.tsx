import React, {memo} from 'react';
import {ButtonDelete, Col, Row, SelectItem} from "../../Auxiliary.tsx";
import Group from "../../../../Auxiliary/Group.tsx";
import clsx from "clsx";
import {IEvent, IPath} from "../../../types.ts";
import TextWrite from "../../../../Auxiliary/TextWrite.tsx";
import {useStoreBook} from "../../../Stores/storeBook.ts";

const Action = ({iPart, iChapter, iScene, iEvent, arrEvent}) => {

    const event: IEvent = arrEvent[iEvent];
    const {desc, id, objectID, subjectID, type} = event;

    const deleteEvent = useStoreBook(state => state.deleteEvent);
    const updateSubEvent = (iEvent: number, subEvent: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {...event, ...subEvent})

    const path = {iPart, iChapter, iScene, iEvent} as IPath

    return (
        <Col className="grow bg-white"><Row>
            <Group>
                <div className={clsx(
                    'bi-lightning-charge-fill',
                    'relative',
                    'flex justify-center items-center',
                    'h-fit p-1',
                    'st-air',
                )}/>
                <ButtonDelete onDelete={() => deleteEvent(iPart, iChapter, iScene, iEvent)}/>
                <SelectItem path={path} id={subjectID} update={(iEvent, id) => updateSubEvent(iEvent, {subjectID: id})}/>
                <SelectItem path={path} id={objectID} update={(iEvent, id) => updateSubEvent(iEvent, {objectID: id})}/>
            </Group>
        </Row>
            <TextWrite value={desc} placeholder="Опишите действие" className="w-full grow *:border-none *:rounded-sm st-air-tx-imp"
                       onChange={({target}) => updateSubEvent(iEvent, {desc: target.value} as IEvent)}/>
        </Col>
    );
};

export default memo(Action);