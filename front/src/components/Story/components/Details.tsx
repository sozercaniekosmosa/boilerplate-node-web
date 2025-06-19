import React, {memo, useState} from 'react';
import TextWrite from "../../Auxiliary/TextWrite.tsx";
import {Col, Row, SwitchButton} from "./Auxiliary.tsx";
import {useStoreBook} from "../Stores/storeBook.ts";
import {IPath} from "../types.ts";
import {Tab, Tabs} from "../../Auxiliary/Tabs.tsx";
import {useStoreGenScene} from "../Stores/storeGenerators.ts";
import {useStoreState} from "../Stores/storeAux.ts";
import clsx from "clsx";


interface IDetails extends React.HTMLAttributes<HTMLDivElement> {
}

const Details: React.FC<IDetails> = ({...rest}) => {

    const [shown, setShown] = useState(0)

    const {isState} = useStoreState();
    const arrPart = useStoreBook(state => state.arrPart);
    const {iPart, iChapter, iScene, iEvent}: IPath = useStoreBook(state => state.currScenePath);
    const updateScene = useStoreBook(state => state.updateScene);
    const scene = arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene];
    const arrGenScene = useStoreGenScene(state => state.arrGen);
    const mapID = useStoreGenScene(state => state.listID);

    if (scene == undefined) return null;
    const {id, aim, sceneID, arrItemID, arrCharacterID, arrEvent} = scene;
    let iSceneSelected = mapID[sceneID];
    if (iSceneSelected == undefined) return null;

    const arrExclude = ['name', 'id'];

    const sceneName = arrGenScene[iSceneSelected]?.name;
    const sceneAim = scene?.aim?.length ? scene?.aim : null;

    return <Tabs defaultActiveKey="scene" className="h-full" {...rest}>
        <Tab eventKey="scene" title="Сцена" className="flex flex-row p-1">
            <Col role="container-scenes" noBorder={true} className="w-full">
                <Row>
                    <SwitchButton id={id + 'prop'}/>
                    <div className={clsx("content-center",
                        sceneName ?? 'text-black/60')}>
                        {sceneName ?? 'Не выбрано'}
                    </div>
                    <div className={clsx("content-center",
                        sceneAim ?? 'text-black/60')}>
                        ({sceneAim ?? '...'})
                    </div>
                </Row>
                {!isState(id + 'prop') && <Col className="ml-1">
                    {arrGenScene[iSceneSelected].arrMapProp.map(({title, value}, i) => {
                        if (!value) return null;
                        return <Col role="scene-item" key={i} noBorder={true}>
                            <Row>
                                <div className={clsx(
                                    "text-black/60 text-nowrap",
                                    shown == 1 ? 'bi-square' : shown == 2 ? 'bi-check-square' : 'bi-square-fill'
                                )} onClick={() => {
                                    let _eye = shown + 1;
                                    if (_eye > 2) _eye = 0;
                                    setShown(_eye);
                                }}/>
                                <div className="text-black/60 text-nowrap">{title}:</div>
                            </Row>
                            <div className={clsx("text-black", "border border-none w-full", "pl-1")}>
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