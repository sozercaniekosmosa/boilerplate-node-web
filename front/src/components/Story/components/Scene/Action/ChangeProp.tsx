import React, {memo} from 'react';
import {ButtonDelete, Col, Row, TextInput} from "../../Auxiliary.tsx";
import Group from "../../../../Auxiliary/Group.tsx";
import clsx from "clsx";
import DropdownButton from "../../../../Auxiliary/DropdownButton.tsx";
import {IChangeProperties, IReplica} from "../../../types.ts";
import TextWrite from "../../../../Auxiliary/TextWrite.tsx";
import {useStoreBook} from "../../../Stores/storeBook.ts";

const ChangeProp = ({iPart, iChapter, iScene, iEvent, arrEvent}) => {

    const {key, value} = arrEvent[iEvent] as IChangeProperties;

    const deleteEvent = useStoreBook(state => state.deleteEvent);

    const updateSubEvent = (iEvent: number, subEvent: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {...arrEvent[iEvent], ...subEvent})

    return (
        <Col className="grow bg-white">
            <Row>
                <Group className="h-full">
                    <div className={clsx(
                        'bi-list-task',
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

                    <DropdownButton title={"Выберите свойство"}>
                        <div className="*:hover:bg-black" onClick={(e: any) => {
                            console.log(e.target)
                            updateSubEvent(iEvent, {key: e.target.textContent} as IChangeProperties)
                        }}>
                            <div>1</div>
                            <div>2</div>
                            <div>3</div>
                        </div>
                    </DropdownButton>
                </Group>
            </Row>
            <TextWrite value={value} placeholder="Значение свойства" className="w-full grow *:border-none *:rounded-sm st-air-tx-imp"
                       onChange={({target}) => updateSubEvent(iEvent, {value: target.value} as IChangeProperties)}/>
        </Col>
    );
};

export default memo(ChangeProp);