import React, {memo, useState} from 'react';
import TextWrite from "../../Auxiliary/TextWrite.tsx";
import {Col, Row, SwitchButton} from "./Auxiliary.tsx";
import {useStoreBook} from "../Stores/storeBook.ts";
import {IPath} from "../types.ts";
import {Tab, Tabs} from "../../Auxiliary/Tabs.tsx";
import {useStoreGenScene} from "../Stores/storeGenerators.ts";
import {useStoreState} from "../Stores/storeAux.ts";
import clsx from "clsx";
import {Tooltip} from '../../Auxiliary/Tooltip.tsx';


interface IDetails extends React.HTMLAttributes<HTMLDivElement> {
}

const Details: React.FC<IDetails> = ({...rest}) => {

    const {isState} = useStoreState();
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
    const {id: idScene, aim, sceneID, arrItemID, arrCharacterID, arrEvent} = scene;
    let iSceneSelected = mapID[sceneID];
    if (iSceneSelected == undefined) return null;

    const arrExclude = ['name', 'id'];

    const sceneName = arrGenScene[iSceneSelected]?.name;
    const sceneAim = scene?.aim?.length ? scene?.aim : null;

    return <Tabs defaultActiveKey="scene" className="h-full" {...rest}>
        <Tab eventKey="scene" title="Сцена" className="flex flex-row p-1">
            <Col role="container-scenes" noBorder={true} className="w-full">
                <Row>
                    <SwitchButton id={idScene + 'prop'}/>
                    <div className={clsx("content-center",
                        sceneName ?? 'text-black/60')}>
                        {sceneName ?? 'Не выбрано'}
                    </div>
                    <div className={clsx("content-center",
                        sceneAim ?? 'text-black/60')}>
                        ({sceneAim ?? '...'})
                    </div>
                </Row>
                {!isState(idScene + 'prop') && <Col className="ml-1">
                    {arrGenScene[iSceneSelected].arrMapProp.map(({title, value, id}, i) => {
                        const {status, idUsingScene} = listStatusDisplay?.[id] ?? {status: false, idUsingScene: null};
                        if (!value) return null;
                        let icon: string = 'bi-square-fill';
                        if (!idUsingScene || idScene == idUsingScene) {
                            icon = !status ? 'bi-square' : 'bi-check-square';
                        }
                        return <Col role="scene-item" key={i} noBorder={true}>
                            <Row>
                                <Tooltip text={'Флаг/отметка — упоминание в тексте'}>
                                    <div className={clsx("text-black/60 text-nowrap", icon)}
                                         onClick={() => {
                                             const _status = !status;
                                             if (!idUsingScene || idScene == idUsingScene)
                                                 if (_status)
                                                     setStatusDisplay(id, idScene, true);
                                                 else
                                                     deleteStatusDisplay(id);
                                         }}/>
                                </Tooltip>
                                <div className="text-black/60 text-nowrap">{title}:</div>
                            </Row>
                            <div className={clsx("text-black", "border border-none w-full", "pl-1 whitespace-pre-line")}>
                                {value}
                            </div>
                        </Col>
                    })}
                </Col>}
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