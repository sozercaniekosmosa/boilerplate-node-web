import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import clsx from "clsx";
import {useStoreBook} from "../../Stores/storeBook.ts";
import {useStoreState} from "../../Stores/storeAux.ts";
import {ButtonDelete, Col, Row, SwitchButton, TextInput} from "../Auxiliary.tsx";
import DropdownButton from "../../../Auxiliary/DropdownButton.tsx";
import {IScene} from "../../types.ts";
import Events from "./Action/Events.tsx";
import Group from "../../../Auxiliary/Group.tsx";
import {useStoreGenCharacter, useStoreGenItem, useStoreGenScene} from "../../Stores/storeGenerators.ts";
import {GenSceneObject} from "./GenSceneObject.tsx";
import ButtonEx from "../../../Auxiliary/ButtonEx.tsx";

interface IScenesProps {
    iPart: number;
    iChapter: number;
    arrScene: IScene[];
}

export const Scenes = ({iPart, iChapter, arrScene}: IScenesProps) => {

    const {isState} = useStoreState();
    const deleteScene = useStoreBook(state => state.deleteScene);
    const updateScene = useStoreBook(state => state.updateScene);
    const setCurrentScenePath = useStoreBook(state => state.setCurrentScenePath);
    const currScenePath = useStoreBook(state => state.currScenePath);
    const arrGenScene = useStoreGenScene(state => state.arrGen);
    const mapID = useStoreGenScene(state => state.listID);

    // @ts-ignore
    window.test = useStoreBook(state => state.test);
    // @ts-ignore
    window.stat = useStoreBook(state => state.status);

    return arrScene.map((scene, iScene) => {
        const {id, aim, sceneID, arrItemID, arrCharacterID, arrEvent} = scene;
        return <Col role="scenes" key={iScene}
                    onClick={(e) => setCurrentScenePath({iPart, iChapter, iScene})}
                    className={clsx((currScenePath.iPart == iPart && currScenePath.iChapter == iChapter && currScenePath.iScene == iScene) ? "bg-gray-200" : "bg-none",)}>
            <Row role="menu-scenes">
                <Group>
                    <SwitchButton id={id}/>
                    <ButtonEx className="bi-stars" title="Сгенерировать" onAction={() => {
                        console.log(scene)
                    }}/>
                    <DropdownButton
                        title={sceneID == '' ? 'Выберите сцену' : 'Сцена ' + (iScene + 1) + '. ' + (arrGenScene[mapID[sceneID]]?.name ?? 'Не выбрано')}>
                        <div className={clsx(
                            "rounded-sm shadow-xl/20",
                            "py-3 *:hover:bg-gray-500/50 *:px-3 *:p-1 *:cursor-pointer bg-white ring-1 ring-gray-500/50"
                        )}
                             onClick={(e: any) => updateScene(iPart, iChapter, iScene, {sceneID: arrGenScene[e.target.dataset.key].id})}>
                            {arrGenScene.map((GenScene, i) => <div key={i} data-key={i}>{GenScene.name}</div>)}
                        </div>
                    </DropdownButton>
                </Group>
                <TextInput value={aim} onChange={(e: any) => {
                    updateScene(iPart, iChapter, iScene, {aim: e.target.value});
                }} placeholder="Введите цель сцены" className="truncate"/>
                <ButtonDelete onDelete={() => deleteScene(iPart, iChapter, iScene)}/>
            </Row>
            {!isState(id) &&
                <Col role="container-scenes" noBorder={true} className="ml-1">
                    <GenSceneObject iPart={iPart} iChapter={iChapter} iScene={iScene} scene={scene}
                                    nameKey="CharacterID"
                                    useStoreGenObj={useStoreGenCharacter} nameObj="Персонажи" icon="bi-person-fill"/>
                    <GenSceneObject iPart={iPart} iChapter={iChapter} iScene={iScene} scene={scene} nameKey="ItemID"
                                    useStoreGenObj={useStoreGenItem} nameObj="Предметы" icon="bi-box"/>
                    <Events iPart={iPart} iChapter={iChapter} iScene={iScene} scene={scene}/>
                </Col>}
        </Col>
    })
}

export default memo(Scenes);