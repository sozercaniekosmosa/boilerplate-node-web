import React, {memo} from 'react';
import {ButtonDelete, Col, Row, TextInput} from "../../Auxiliary.tsx";
import Group from "../../../../Auxiliary/Group.tsx";
import clsx from "clsx";
import DropdownButton from "../../../../Auxiliary/DropdownButton.tsx";
import {IAction, IReplica} from "../../../types.ts";
import TextWrite from "../../../../Auxiliary/TextWrite.tsx";
import {useStoreBook} from "../../../Stores/storeBook.ts";

const Action = ({iPart, iChapter, iScene, iEvent, arrEvent}) => {

    const {desc} = arrEvent[iEvent] as IAction;

    const deleteEvent = useStoreBook(state => state.deleteEvent);

    const updateSubEvent = (iEvent: number, subEvent: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {...arrEvent[iEvent], ...subEvent})

    return (
        <Col className="grow bg-white"><Row>
            <Group>
                <div className={clsx('bi-lightning-charge-fill', 'relative h-fit',
                    'text-base text-white p-1 rounded-sm',
                    'focus:outline-none focus:ring-3 focus:ring-offset-0 focus:ring-gray-500/50 select-none',
                    'bg-gray-500',
                    'flex justify-center items-center',)}/>
                <ButtonDelete onDelete={() => deleteEvent(iPart, iChapter, iScene, iEvent)}/>
                <DropdownButton title={"object"}>
                    <div className="*:hover:bg-black" onClick={(e: any) => {
                        console.log(e.target)
                    }}>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                    </div>
                </DropdownButton>
                <DropdownButton title={"subject"}>
                    <div className="*:hover:bg-black" onClick={(e: any) => {
                        console.log(e.target)
                    }}>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                    </div>
                </DropdownButton>
            </Group>
        </Row>
            <TextWrite value={desc} placeholder="Опишите действие" className="w-full grow *:border-none *:rounded-sm"
                       onChange={({target}) => updateSubEvent(iEvent, {desc: target.value} as IAction)}/>
        </Col>
    );
};

export default memo(Action);