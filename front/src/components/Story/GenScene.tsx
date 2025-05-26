import React, {memo} from 'react';
import clsx from "clsx";
import {ButtonDelete, Col, Row, SwitchHide, Text, TextInput} from "./components/Auxiliary.tsx";
import ButtonEx from "../Auxiliary/ButtonEx.tsx";
import Group from "../Auxiliary/Group.tsx";
import {useStoreGenScene} from "./Stores/storeGenerators.ts";
import {useStoreFolding} from "./Stores/storeAux.ts";
import {arrMapOfScene} from "./maps.ts";
import {IMap, IGenScene} from "./types.ts";
import TextWrite from "../Auxiliary/TextWrite.tsx";
import {Tooltip} from "../Auxiliary/Tooltip.tsx";

interface IGenSceneProp extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const GenScene: React.FC<IGenSceneProp> = ({className, ...rest}) => {

    const arrGenScene = useStoreGenScene(state => state.arrGenScene);
    const addGenScene = useStoreGenScene(state => state.addGenScene);
    const updateGenSceneName = useStoreGenScene(state => state.updateGenSceneName);
    const updateGenSceneProp = useStoreGenScene(state => state.updateGenSceneProp);
    const addGenSceneProp = useStoreGenScene(state => state.addGenSceneProp);
    const deleteGenScene = useStoreGenScene(state => state.deleteGenScene);
    const {isHide} = useStoreFolding();
    const arrExclude = ['name', 'id'];

    return <Col role="scenes-gen" noBorder={true} className={clsx(className, "h-full", "bg-white")}>
        <Row role="scenes-menu">
            <ButtonEx className={clsx("bi-plus-circle")} title="Добавить новую сцену" onClick={() => addGenScene()}/>
            <Text>Создать сцену</Text>
        </Row>

        {arrGenScene.map(((scene, iScene) => {
            const {id, name, arrMapProp} = scene;
            return <Col key={iScene} noBorder={true}>
                <Row role="scene-menu">
                    <Group>
                        <SwitchHide id={id}/>
                        <ButtonEx className={clsx("bi-plus-circle")} title="Добавить новое свойство"
                                  onClick={() => addGenSceneProp(iScene)}/>
                        <ButtonDelete onDelete={() => deleteGenScene(iScene)}/>
                    </Group>
                    <TextInput value={name} placeholder="Название сцены"
                               onChange={(e: any) => updateGenSceneName(iScene, e.target.value)}/>
                </Row>
                {!isHide(id) && <div className="pl-1 flex flex-wrap gap-1">
                    {arrMapProp.map((mapProp, i) => {
                        const {name, title, desc, type, text} = mapProp;
                        return !arrExclude.includes(name) &&
                            <Col role="scene-prop" key={i} className="w-[33%] !gap-0">
                                <Row className="text-black/60">
                                    <Tooltip text={desc} className="bi-info-circle"/>
                                    {title}
                                </Row>
                                <TextWrite
                                    className="w-full border-none" fitToTextSize={true} placeholder={title}
                                    value={text}
                                    onChange={(e: any) => updateGenSceneProp(iScene, i, 'text', e.target.value)}/>
                            </Col>
                    })}
                </div>}
            </Col>

        }))}

    </Col>;
};

export default memo(GenScene);