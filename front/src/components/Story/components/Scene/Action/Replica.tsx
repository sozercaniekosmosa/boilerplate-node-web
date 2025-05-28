import React, {memo} from 'react';
import {ButtonDelete, Col, Row, TextInput} from "../../Auxiliary.tsx";
import Group from "../../../../Auxiliary/Group.tsx";
import clsx from "clsx";
import DropdownButton from "../../../../Auxiliary/DropdownButton.tsx";
import {IReplica} from "../../../types.ts";
import TextWrite from "../../../../Auxiliary/TextWrite.tsx";
import {useStoreBook} from "../../../Stores/storeBook.ts";

const Replica = ({iPart, iChapter, iScene, iEvent, arrEvent}) => {

    const {text, manner} = arrEvent[iEvent] as IReplica;

    const deleteEvent = useStoreBook(state => state.deleteEvent);

    const updateSubEvent = (iEvent: number, subEvent: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {...arrEvent[iEvent], ...subEvent})

    return (
        <Col className="grow bg-white">
            <Row className="grow">
                <Group>
                    <div className={clsx(
                        'bi-chat-left-fill',
                        'relative',
                        'flex justify-center items-center',
                        'h-fit p-1',
                        'st-air',
                    )}/>
                    <ButtonDelete onDelete={() => deleteEvent(iPart, iChapter, iScene, iEvent)}/>
                    <DropdownButton title={"subject"}>
                        <div className="*:hover:bg-black" onClick={(e: any) => {
                            console.log(e.target)
                        }}>
                            <div>1</div>
                            <div>2</div>
                            <div>3</div>
                        </div>
                    </DropdownButton>
                    <DropdownButton title={"object"}>
                        <div className="*:hover:bg-black" onClick={(e: any) => {
                            console.log(e.target)
                        }}>
                            <div>1</div>
                            <div>2</div>
                            <div>3</div>
                        </div>
                    </DropdownButton>
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