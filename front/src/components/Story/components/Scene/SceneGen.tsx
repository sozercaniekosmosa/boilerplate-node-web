import React, {memo} from 'react';
import clsx from "clsx";
import {ButtonDelete, Col, Row, SwitchHide, Text, TextInput} from "../Auxiliary.tsx";
import ButtonEx from "../../../Auxiliary/ButtonEx.tsx";
import Group from "../../../Auxiliary/Group.tsx";
import Chapters from "../Chapters.tsx";
import {useStoreBook} from "../../Stores/storeBook.ts";
import {useShallow} from "zustand/react/shallow";
import {useStoreScenesGen} from "../../Stores/storeScenes.ts";
import {useStoreFolding} from "../../Stores/storeAux.ts";
import {arrMapOfScene} from "../../maps.ts";
import {IReplica, ISceneGen} from "../../types.ts";
import TextWrite from "../../../Auxiliary/TextWrite.tsx";
import {Tooltip} from "../../../Auxiliary/Tooltip.tsx";

interface ISceneGenProp extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const SceneGen: React.FC<ISceneGenProp> = ({className, ...rest}) => {

    const arrScenes = useStoreScenesGen(state => state.arrScenes);
    const addScene = useStoreScenesGen(state => state.addScene);
    const updateScene = useStoreScenesGen(state => state.updateScene);
    const deleteScene = useStoreScenesGen(state => state.deleteScene);
    const {isHide} = useStoreFolding();
    const arrExclude = ['name', 'id'];

    return <Col role="scenes-gen" noBorder={true} className={clsx(className, "h-full", "bg-white")}>
        <Row role="scenes-menu">
            <ButtonEx className={clsx("bi-plus-circle")} title="Добавить новую сцену" onClick={() => addScene()}/>
            <Text>Создать сцену</Text>
        </Row>
        {arrScenes.map(((scene, iScene) => {
            const {detailsEnv, id, location, mood, name, pointOfView, sensors, symbols, time} = scene;
            return <Col key={iScene}>
                <Row>
                    <SwitchHide id={id}/>
                    <TextInput value={arrScenes[iScene].name} placeholder="Название сцены"
                               onChange={(e: any) => updateScene(iScene, {'name': e.target.value} as ISceneGen)}/>
                </Row>
                {!isHide(id) && arrMapOfScene.map(({name, title, desc}, i) => {
                    return !arrExclude.includes(name) &&
                        <Col role="scene-item" noBorder={true} key={i}>
                            <Col noBorder={true}>
                                <Row>
                                    <Tooltip text={desc}>
                                        {title}
                                    </Tooltip>
                                </Row>
                                <TextWrite value={arrScenes[iScene][name]} className="w-full" fitToTextSize={true}
                                           onChange={(e: any) => updateScene(iScene, {[name]: e.target.value} as ISceneGen)}/>
                            </Col>
                        </Col>
                })}
            </Col>

        }))}

    </Col>;
};

export default memo(SceneGen);