import React, {memo} from 'react';
import {ButtonDelete, Col, Row, SelectCharacters, TextInput} from "../../Auxiliary.tsx";
import Group from "../../../../Auxiliary/Group.tsx";
import clsx from "clsx";
import {IPath, IReplica} from "../../../types.ts";
import TextWrite from "../../../../Auxiliary/TextWrite.tsx";
import {useStoreBook} from "../../../Stores/storeBook.ts";
import {useStoreGenCharacter, useStoreGenItem} from "../../../Stores/storeGenerators.ts";

const Replica = ({iPart, iChapter, iScene, iEvent, arrEvent}) => {

    const event: IReplica = arrEvent[iEvent];
    const {text, manner, id, objectID, subjectID, type} = event;

    const deleteEvent = useStoreBook(state => state.deleteEvent);

    const updateSubEvent = (iEvent: number, subEvent: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {...arrEvent[iEvent], ...subEvent})

    const arrPart = useStoreBook(state => state.arrPart);
    const arrGenCharacter = useStoreGenCharacter(state => state.arrGen);
    const listIDCharacter = useStoreGenCharacter(state => state.listID);
    const arrGenItem = useStoreGenItem(state => state.arrGen);
    const listIDItem = useStoreGenItem(state => state.listID);

    const scene = arrPart[iPart].arrChapter[iPart].arrScene[iScene];


    const getByID = (id: string) => {
        var _u = undefined;
        return listIDCharacter?.[id] != _u ? arrGenCharacter[listIDCharacter[id]] : listIDItem?.[id] != _u ? arrGenItem[listIDItem[id]] : null;
    }

    const path = {iPart, iChapter, iScene, iEvent} as IPath

    return (
        <Col className="grow bg-white">
            <Row className="grow">
                <Group>
                    <div className={clsx(
                        'bi-chat-square-fill',
                        'relative',
                        'flex justify-center items-center',
                        'h-fit p-1',
                        'st-air',
                    )}/>
                    <ButtonDelete onDelete={() => deleteEvent(iPart, iChapter, iScene, iEvent)}/>
                    <SelectCharacters path={path} id={subjectID} nameField="subject" event={event}/>
                    <SelectCharacters path={path} id={objectID} nameField="object" event={event}/>

                </Group>
                <TextInput value={manner} placeholder="Манера/тон реплики" className="st-air-tx-imp"
                           onChange={({target}) => updateSubEvent(iEvent, {manner: target.value,} as IReplica)}/>
            </Row>
            <TextWrite value={text} placeholder="Текст реплики" className="w-full grow *:border-none *:rounded-sm st-air-tx-imp"
                       fitToTextSize={true}
                       onChange={({target}) => updateSubEvent(iEvent, {text: target.value,} as IReplica)}/>
        </Col>
    );
};

export default memo(Replica);