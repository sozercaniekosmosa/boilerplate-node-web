import React, {memo} from 'react';
import PropTypes from 'prop-types';
import TextWrite from "../../Auxiliary/TextWrite.tsx";
import {Col, Row, SwitchHide} from "./Auxiliary.tsx";
import {useStoreBook} from "../Stores/storeBook.ts";
import {IPath, IGenScene} from "../types.ts";
import {Tab, Tabs} from "../../Auxiliary/Tabs.tsx";
import {useStoreGenScene} from "../Stores/storeGenerators.ts";
import Items from "./Scene/Items.tsx";
import Events from "./Scene/Action/Events.tsx";
import {arrMapOfScene} from "../maps.ts";
import {Tooltip} from "../../Auxiliary/Tooltip.tsx";
import {useStoreFolding} from "../Stores/storeAux.ts";
import clsx from "clsx";


interface IDetails extends React.HTMLAttributes<HTMLDivElement> {
}

const Details: React.FC<IDetails> = ({...rest}) => {

    const {isHide} = useStoreFolding();
    const arrPart = useStoreBook(state => state.arrPart);
    const {iPart, iChapter, iScene, iEvent}: IPath = useStoreBook(state => state.currScenePath);
    const updateScene = useStoreBook(state => state.updateScene);
    const scene = arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene];
    const arrGenScene = useStoreGenScene(state => state.arrGen);
    const mapID = useStoreGenScene(state => state.listID);

    if (scene == undefined) return null;
    const {id, aim, sceneID, arrItem, arrCharacter, arrEvent} = scene;
    if (mapID[sceneID] == undefined) return null;

    const arrExclude = ['name', 'id'];

    const sceneName = arrGenScene[mapID[sceneID]]?.name;
    const sceneAim = scene?.aim?.length ? scene?.aim : null;

    return <Tabs defaultActiveKey="scene" className="h-full" {...rest}>
        <Tab eventKey="scene" title="Сцена" className="flex flex-row p-1">
            <Col role="container-scenes" noBorder={true} className="w-full">
                <Row>
                    <SwitchHide id={id + 'prop'}/>
                    <div className={clsx("content-center",
                        sceneName ?? 'text-black/60')}>
                        {sceneName ?? 'Не выбрано'}
                    </div>
                    <div className={clsx("content-center",
                        sceneAim ?? 'text-black/60')}>
                        {sceneAim ?? '...'}
                    </div>
                </Row>
                {!isHide(id + 'prop') && <Col className="ml-1">
                    {arrGenScene.map(({name, id, arrMapProp}, i) => {
                        if (!name) return null;
                        return !arrExclude.includes(name) && arrMapProp.map(({title, text}, i) => {
                            if(!text) return null;
                            return <Row role="scene-item" key={i}>
                                <div className="text-black/60 text-nowrap">{title}:</div>
                                <div className={clsx(
                                    "text-black",
                                    "border border-none w-full",
                                    "pl-1 leading-[.9rem]",
                                )}>{text}</div>
                            </Row>
                        })
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