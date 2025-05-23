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
import {useStoreScenesGen} from "../../Stores/storeScenes.ts";

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
    const arrSceneGen = useStoreScenesGen(state => state.arrSceneGen);
    const mapID = useStoreScenesGen(state => state.mapID);

    return arrScene.map((scene, iScene) => {
        const {id, name, sceneID, arrItem, arrCharacter, arrEvent} = scene;
        let {
            detailsEnv,
            location,
            mood,
            name: ns,
            pointOfView,
            sensors,
            symbols,
            time
        } = mapID[sceneID] ? arrSceneGen[mapID[sceneID]] : {};
        return <Col role="scenes" key={iScene}
                    onClick={(e) => setCurrentScenePath({iPart, iChapter, iScene})}
                    className={clsx((currScenePath.iPart == iPart && currScenePath.iChapter == iChapter && currScenePath.iScene == iScene) ? "bg-gray-200" : "bg-none",)}>
            <Row role="menu-scenes">
                <Group>
                    <SwitchHide id={id}/>
                    <DropdownButton
                        title={sceneID == '' ? 'Выберите сцену' : 'Сцена ' + (iScene + 1) + '. ' + (arrSceneGen[mapID[sceneID]]?.name ?? 'Не выбрано')}>
                        <div className="*:hover:bg-gray-500/50 *:p-1"
                             onClick={(e: any) => updateScene(iPart, iChapter, iScene, {sceneID: arrSceneGen[e.target.dataset.key].id})}>
                            {arrSceneGen.map((sceneGen, i) => <div key={i} data-key={i}>{sceneGen.name}</div>)}
                        </div>
                    </DropdownButton>
                    <ButtonDelete onDelete={() => deleteScene(iPart, iChapter, iScene)}/>
                </Group>
                <TextInput value={name} onChange={(e: any) => {
                    updateScene(iPart, iChapter, iScene, {name: e.target.value});
                }} placeholder="Название сцены"/>
            </Row>
            {!isHide(id) &&
                <Col role="container-scenes" noBorder={true} className="ml-1">
                    <div>
                        {detailsEnv}
                        {location}
                        {mood}
                        {pointOfView}
                        {sensors}
                        {symbols}
                        {time}
                    </div>
                    <Characters iPart={iPart} iChapter={iChapter} iScene={iScene} scene={scene}/>
                    <Items iPart={iPart} iChapter={iChapter} iScene={iScene} scene={scene}/>
                    <Events iPart={iPart} iChapter={iChapter} iScene={iScene} scene={scene}/>
                </Col>}
        </Col>
    })
}

export default memo(Scenes);