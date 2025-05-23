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

    const arrSceneGen = useStoreScenesGen(state => state.arrSceneGen);
    const addSceneGen = useStoreScenesGen(state => state.addSceneGen);
    const updateSceneGen = useStoreScenesGen(state => state.updateSceneGen);
    const deleteSceneGen = useStoreScenesGen(state => state.deleteSceneGen);
    const {isHide} = useStoreFolding();
    const arrExclude = ['name', 'id'];

    return <Col role="scenes-gen" noBorder={true} className={clsx(className, "h-full", "bg-white")}>
        <Row role="scenes-menu">
            <ButtonEx className={clsx("bi-plus-circle")} title="Добавить новую сцену" onClick={() => addSceneGen()}/>
            <Text>Создать сцену</Text>
        </Row>

        {arrSceneGen.map(((scene, iScene) => {
            const {detailsEnv, id, location, mood, name, pointOfView, sensors, symbols, time} = scene;
            return <Col key={iScene}>
                <Row role="scene-menu">
                    <Group>
                        <SwitchHide id={id}/>
                        <ButtonDelete onDelete={() => deleteSceneGen(iScene)}/>
                    </Group>
                    <TextInput value={arrSceneGen[iScene].name} placeholder="Название сцены"
                               onChange={(e: any) => updateSceneGen(iScene, {'name': e.target.value} as ISceneGen)}/>
                </Row>
                {!isHide(id) && <div className="pl-1 flex flex-wrap gap-1">
                    {arrMapOfScene.map(({name, title, desc}, i) => {
                        return !arrExclude.includes(name) &&
                            <Col role="scene-item" noBorder={true} key={i} className="w-[33%]">
                                <Col noBorder={true}>
                                    <Row>
                                        <Tooltip text={desc} className="bi-info-circle"/>
                                        {title}
                                    </Row>
                                    <TextWrite value={arrSceneGen[iScene][name]} className="w-full" fitToTextSize={true}
                                               placeholder={title}
                                               onChange={(e: any) => updateSceneGen(iScene, {[name]: e.target.value} as ISceneGen)}/>
                                </Col>
                            </Col>
                    })}
                </div>}
            </Col>

        }))}

    </Col>;
};

export default memo(SceneGen);