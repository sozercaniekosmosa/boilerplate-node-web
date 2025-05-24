import React, {memo} from 'react';
import PropTypes from 'prop-types';
import TextWrite from "../../Auxiliary/TextWrite.tsx";
import {Col, Row} from "./Auxiliary.tsx";
import {useStoreBook} from "../Stores/storeBook.ts";
import {IPath, ISceneGen} from "../types.ts";
import {Tab, Tabs} from "../../Auxiliary/Tabs.tsx";
import {useStoreScenesGen} from "../Stores/storeScenes.ts";
import Items from "./Scene/Items.tsx";
import Events from "./Scene/Action/Events.tsx";
import {arrMapOfScene} from "../maps.ts";
import {Tooltip} from "../../Auxiliary/Tooltip.tsx";


interface IDetails extends React.HTMLAttributes<HTMLDivElement> {
}

const Details: React.FC<IDetails> = ({...rest}) => {

    const arrPart = useStoreBook(state => state.arrPart);
    const {iPart, iChapter, iScene, iEvent}: IPath = useStoreBook(state => state.currScenePath);
    const updateScene = useStoreBook(state => state.updateScene);
    const scene = arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene];
    const arrSceneGen = useStoreScenesGen(state => state.arrSceneGen);
    const mapID = useStoreScenesGen(state => state.mapID);


    const {id, name, sceneID, arrItem, arrCharacter, arrEvent} = scene;
    if (mapID[sceneID]) return null;

    let {
        detailsEnv,
        location,
        mood,
        sensors,
        symbols,
        time
    } = mapID[sceneID] != undefined ? arrSceneGen[mapID[sceneID]] : {};


    const arrExclude = ['name', 'id'];

    return <Tabs defaultActiveKey="scene" className="h-full" {...rest}>
        <Tab eventKey="scene" title="Сцена" className="flex flex-row">
            <Col role="container-scenes" noBorder={true} className="ml-1">
                {arrMapOfScene.map(({name, title, desc}, i) => {
                    return !arrExclude.includes(name) &&
                        <Col role="scene-item" key={i} noBorder={true}>
                            <div className="text-black/60">{title}</div>
                            <div className="text-black">{arrSceneGen[mapID[sceneID]]?.[name]}</div>
                        </Col>
                })}
            </Col>
        </Tab>
        <Tab eventKey="text" title="Текст" className="flex flex-row">
            <Col noBorder={true} className="w-full">
                <div>{scene?.name ?? 'Название сцены'}</div>
                <TextWrite value={scene?.text} className="h-full" placeholder="Введите текст описывающий сцену"
                           onChange={(e: any) => {
                               updateScene(iPart, iChapter, iScene, {text: e.target.value});
                           }}/>
            </Col>
        </Tab>
    </Tabs>;
};

export default memo(Details);