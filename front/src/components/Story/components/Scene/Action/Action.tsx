import React, {memo} from 'react';
import {ButtonDelete, Col, Row} from "../../Auxiliary.tsx";
import Group from "../../../../Auxiliary/Group.tsx";
import clsx from "clsx";
import DropdownButton from "../../../../Auxiliary/DropdownButton.tsx";
import {IAction} from "../../../types.ts";
import TextWrite from "../../../../Auxiliary/TextWrite.tsx";
import {useStoreBook} from "../../../Stores/storeBook.ts";
import {useStoreGenCharacter, useStoreGenItem, useStoreGenScene} from "../../../Stores/storeGenerators.ts";

const Action = ({iPart, iChapter, iScene, iEvent, arrEvent}) => {

    const {desc, id, object, subject, type} = arrEvent[iEvent] as IAction;

    const deleteEvent = useStoreBook(state => state.deleteEvent);
    const arrGenScene = useStoreGenScene(state => state.arrGen);
    const arrGenCharacter = useStoreGenCharacter(state => state.arrGen);
    const arrGenItem = useStoreGenItem(state => state.arrGen);
    const updateSubEvent = (iEvent: number, subEvent: any) => useStoreBook.getState().updateEvent(iPart, iChapter, iScene, iEvent, {...arrEvent[iEvent], ...subEvent})

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
                <DropdownButton title={"subject"}>
                    <div className="py-3 *:hover:bg-gray-500/50 *:px-3 *:p-1 *:cursor-pointer"
                         onClick={(e: any) => 0/*updateScene(iPart, iChapter, iScene, {sceneID: arrGenScene[e.target.dataset.key].id})*/}>
                        {arrGenScene.map((GenScene, i) => <div key={i} data-key={i}>{GenScene.name}</div>)}
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
        </Row>
            <TextWrite value={desc} placeholder="Опишите действие" className="w-full grow *:border-none *:rounded-sm st-air-tx-imp"
                       onChange={({target}) => updateSubEvent(iEvent, {desc: target.value} as IAction)}/>
        </Col>
    );
};

export default memo(Action);