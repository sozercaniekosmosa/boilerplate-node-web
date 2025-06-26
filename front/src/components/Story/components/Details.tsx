import React, {memo} from 'react';
import TextWrite from "../../Auxiliary/TextWrite.tsx";
import {Col, Row, SwitchButton} from "./Auxiliary.tsx";
import {useStoreBook} from "../Stores/storeBook.ts";
import {IPath} from "../types.ts";
import {Tab, Tabs} from "../../Auxiliary/Tabs.tsx";
import {useStoreGenCharacter, useStoreGenItem, useStoreGenScene} from "../Stores/storeGenerators.ts";
import {useStoreState} from "../Stores/storeAux.ts";
import clsx from "clsx";
import {Tooltip} from '../../Auxiliary/Tooltip.tsx';


function PropertyOfDetails({path, idScene, itGen, listID}) {
    const updateScene = useStoreBook(state => state.updateScene);
    const setStatusDisplay = useStoreBook(state => state.setStatusDisplay);
    const listStatusDisplay = useStoreBook(state => state.listStatusDisplay);

    return <Col className="ml-1">
        {itGen.arrMapProp.map(({title, value, id}, i) => {

            if (!value) return null;

            return <Col role="scene-item" key={i} noBorder={true}>
                <Row className="relative pl-1">
                    <Tooltip text={'— упоминание в тексте'}>
                        <div
                            className={clsx("text-black/60 text-nowrap", listID?.[id] ? 'bi-check-square' : 'bi-square')}
                            onClick={() => {
                                const isEx = !(listID?.[id] ?? false);
                                updateScene(path.iPart, path.iChapter, path.iScene, {listID: {...listID, [id]: isEx}});
                                setStatusDisplay(id, idScene, isEx);
                            }}/>
                        {listStatusDisplay?.[id] && !listStatusDisplay?.[id]?.[idScene] &&
                            <div className="absolute top-0 bi-stop-fill pointer-events-none text-black/30"></div>}
                            {/*<div className="absolute -left-2.5 top-0 bi-three-dots-vertical pointer-events-none text-black/60"></div>}*/}
                    </Tooltip>
                    <div className="text-black/60 text-nowrap">{title}:</div>
                </Row>
                <div
                    className={clsx("text-black", "border border-none w-full", "pl-1 whitespace-pre-line")}>
                    {value}
                </div>
            </Col>
        })}
    </Col>
}


interface IDetails extends React.HTMLAttributes<HTMLDivElement> {
}

const Details: React.FC<IDetails> = ({...rest}) => {

    const {isState} = useStoreState();
    const listIDCharacter = useStoreGenCharacter((store) => store.listID);
    const arrGenCharacter = useStoreGenCharacter((store) => store.arrGen);
    const listIDItem = useStoreGenItem((store) => store.listID);
    const arrGenItem = useStoreGenItem((store) => store.arrGen);
    const arrPart = useStoreBook(state => state.arrPart);
    const {iPart, iChapter, iScene, iEvent}: IPath = useStoreBook(state => state.currScenePath);
    const updateScene = useStoreBook(state => state.updateScene);
    const scene = arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene];
    const arrGenScene = useStoreGenScene(state => state.arrGen);
    const mapID = useStoreGenScene(state => state.listID);
    const listStatusDisplay = useStoreBook(state => state.listStatusDisplay);
    const setStatusDisplay = useStoreBook(state => state.setStatusDisplay);
    const deleteStatusDisplay = useStoreBook(state => state.deleteStatusDisplay);

    if (scene == undefined) return null;
    const {id: idScene, aim, sceneID, arrItemID, arrCharacterID, arrEvent, listID} = scene;
    let iSceneSelected = mapID[sceneID];
    if (iSceneSelected == undefined) return null;

    const arrExclude = ['name', 'id'];

    const sceneName = arrGenScene[iSceneSelected]?.name;
    const sceneAim = scene?.aim?.length ? scene?.aim : null;

    return <Tabs defaultActiveKey="scene" className="h-full" {...rest}>
        <Tab eventKey="scene" title="Сцена" className="flex flex-col overflow-x-hidden overflow-y-auto grow p-1">

            <Col role="container-scenes" noBorder={true} className="w-full">
                <Row>
                    <SwitchButton id={idScene + 'd-scene'}/>
                    <div className={clsx("content-center",
                        sceneName ?? 'text-black/60')}>
                        {sceneName ?? 'Не выбрано'}
                    </div>
                    <div className={clsx("content-center",
                        sceneAim ?? 'text-black/60')}>
                        ({sceneAim ?? '...'})
                    </div>
                </Row>
                {!isState(idScene + 'd-scene') &&
                    <PropertyOfDetails itGen={arrGenScene[iSceneSelected]} idScene={idScene} listID={listID} path={
                        {iPart, iChapter, iScene}}/>}
            </Col>

            <Col role="container-charact" noBorder={true} className="mt-1 w-full">
                <Row>
                    <SwitchButton id={idScene + 'd-char'}/>
                    <div>Персонажи</div>
                </Row>
                {!isState(idScene + 'd-char') &&
                    <PropertyOfDetails itGen={arrGenCharacter[iSceneSelected]} idScene={idScene} listID={listID} path={
                        {iPart, iChapter, iScene}}/>}
            </Col>

            <Col role="container-item" noBorder={true} className="mt-1 w-full">
                <Row>
                    <SwitchButton id={idScene + 'd-item'}/>
                    <div>Предметы</div>
                </Row>
                {!isState(idScene + 'd-item') &&
                    <PropertyOfDetails itGen={arrGenItem[iSceneSelected]} idScene={idScene} listID={listID} path={
                        {iPart, iChapter, iScene}}/>}
            </Col>
        </Tab>
        <Tab eventKey="text" title="Текст" className="flex flex-row p-1">
            <Col noBorder={true} className="w-full">
                <div>{sceneName} </div>
                <div>{sceneAim}</div>
                <TextWrite value={scene?.text} className="h-full" placeholder="Введите текст описывающий сцену"
                           onChange={(e: any) => {
                               updateScene(iPart, iChapter, iScene, {text: e.target.value});
                           }}/>
            </Col>
        </Tab>
    </Tabs>;
};

export default memo(Details);