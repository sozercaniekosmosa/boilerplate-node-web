import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import clsx from "clsx";
import {useStoreBook} from "../../Stores/storeBook.ts";
import {useStoreState} from "../../Stores/storeAux.ts";
import {ButtonDelete, Col, Row, SwitchButton, Text} from "../Auxiliary.tsx";
import Group from "../../../Auxiliary/Group.tsx";
import DropdownButton from "../../../Auxiliary/DropdownButton.tsx";
import {IScene} from "../../types.ts";

export const GenSceneObject = ({iPart, iChapter, iScene, scene, nameKey, nameObj, useStoreGenObj, icon}) => {
    const {id} = scene as IScene;

    const {isState} = useStoreState();
    const addObj = useStoreBook(state => state['add' + nameKey]);
    const deleteObj = useStoreBook(state => state['delete' + nameKey]);
    const arrGenObj = useStoreGenObj((state: { arrGen: any; }) => state.arrGen);
    const listID = useStoreGenObj((state: { listID: any; }) => state.listID);

    return <Col role="gen-scene-object" className="" noBorder={true}>
        <Row role="menu-gen-scene-object">
            <Group>
                <SwitchButton id={id + 's' + nameKey}/>
                <DropdownButton title="" className={clsx("h-full", icon)}>
                    <div className={
                        clsx(
                            "py-3 *:hover:bg-gray-500/50 *:px-3 *:p-1",
                            "*:cursor-pointer w-80",
                            "rounded-sm shadow-xl/20",
                            "bg-white ring-1 ring-gray-500/50 !gap-0",
                        )
                    }
                         onClick={(e: any) => {
                             const {id: objID} = arrGenObj[e.target.dataset.key];
                             if (scene['arr' + nameKey].find((it: any) => it === objID)) return;
                             addObj(iPart, iChapter, iScene, objID)
                         }}>
                        {arrGenObj.map((obj: any, i: number) => <div key={i} data-key={i}>{obj.name}</div>)}
                    </div>
                </DropdownButton>
            </Group>
            <Text>{nameObj}</Text>
        </Row>
        {!isState(id + 's' + nameKey) &&
            <div className="flex flex-wrap gap-1">{
                scene['arr' + nameKey].map((id: string, i: number) =>
                    <Row key={i} className="border border-black/20 rounded px-1 bg-white items-center min-w-0">
                        <div className={clsx(icon, 'st-air-tx')}/>
                        <div className="select-none truncate w-full">{arrGenObj?.[listID?.[id]]?.name}</div>
                        <ButtonDelete className="!p-0 st-danger" onDelete={() => deleteObj(iPart, iChapter, iScene, i)} icon="bi-x"/>
                    </Row>)
            }</div>
        }
    </Col>
}

export default memo(GenSceneObject);