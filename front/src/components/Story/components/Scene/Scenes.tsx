import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../../Auxiliary/ButtonEx.tsx";
import clsx from "clsx";
import {useStoreBook} from "../../Stores/storeBook.ts";
import {useStoreFolding} from "../../Stores/storeAux.ts";
import {ButtonDelete, Col, Row, SwitchHide, TextInput} from "../Auxiliary.tsx";
import DropdownButton from "../../../Auxiliary/DropdownButton.tsx";
import {IScene} from "../../types.ts";
import Characters from "./Characters.tsx";
import Items from "./Items.tsx";
import Events from "./Action/Events.tsx";
import Group from "../../../Auxiliary/Group.tsx";
import {useStoreGenScene} from "../../Stores/storeGenerators.ts";

interface IScenesProps {
    iPart: number;
    iChapter: number;
    arrScene: IScene[];
}

export const Scenes = ({iPart, iChapter, arrScene}: IScenesProps) => {

    const {isHide} = useStoreFolding();
    const deleteScene = useStoreBook(state => state.deleteScene);
    const updateScene = useStoreBook(state => state.updateScene);
    const setCurrentScenePath = useStoreBook(state => state.setCurrentScenePath);
    const currScenePath = useStoreBook(state => state.currScenePath);
    const arrGenScene = useStoreGenScene(state => state.arrGen);
    const mapID = useStoreGenScene(state => state.listID);

    return arrScene.map((scene, iScene) => {
        const {id, aim, sceneID, arrItem, arrCharacter, arrEvent} = scene;
        return <Col role="scenes" key={iScene}
                    onClick={(e) => setCurrentScenePath({iPart, iChapter, iScene})}
                    className={clsx((currScenePath.iPart == iPart && currScenePath.iChapter == iChapter && currScenePath.iScene == iScene) ? "bg-gray-200" : "bg-none",)}>
            <Row role="menu-scenes">
                <Group>
                    <SwitchHide id={id}/>
                    <DropdownButton
                        title={sceneID == '' ? 'Выберите сцену' : 'Сцена ' + (iScene + 1) + '. ' + (arrGenScene[mapID[sceneID]]?.name ?? 'Не выбрано')}>
                        <div className="*:hover:bg-gray-500/50 *:p-1"
                             onClick={(e: any) => updateScene(iPart, iChapter, iScene, {sceneID: arrGenScene[e.target.dataset.key].id})}>
                            {arrGenScene.map((GenScene, i) => <div key={i} data-key={i}>{GenScene.name}</div>)}
                        </div>
                    </DropdownButton>
                    <ButtonDelete onDelete={() => deleteScene(iPart, iChapter, iScene)}/>
                </Group>
                <TextInput value={aim} onChange={(e: any) => {
                    updateScene(iPart, iChapter, iScene, {aim: e.target.value});
                }} placeholder="Введите цель сцены"/>
            </Row>
            {!isHide(id) &&
                <Col role="container-scenes" noBorder={true} className="ml-1">
                    <Characters iPart={iPart} iChapter={iChapter} iScene={iScene} scene={scene}/>
                    <Items iPart={iPart} iChapter={iChapter} iScene={iScene} scene={scene}/>
                    <Events iPart={iPart} iChapter={iChapter} iScene={iScene} scene={scene}/>
                </Col>}
        </Col>
    })
}

export default memo(Scenes);