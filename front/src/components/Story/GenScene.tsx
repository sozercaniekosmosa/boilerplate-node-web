import React, {memo, useEffect, useState} from 'react';
import clsx from "clsx";
import {ButtonDelete, Col, Row, SwitchHide, Text, TextInput} from "./components/Auxiliary.tsx";
import ButtonEx from "../Auxiliary/ButtonEx.tsx";
import Group from "../Auxiliary/Group.tsx";
import {useStoreGenScene} from "./Stores/storeGenerators.ts";
import {useStoreFolding} from "./Stores/storeAux.ts";
import {IMapProp, IStoreGen} from "./types.ts";
import TextWrite from "../Auxiliary/TextWrite.tsx";
import {Tooltip} from "../Auxiliary/Tooltip.tsx";
import {useShallow} from "zustand/react/shallow";
import {ExtractState, StoreApi} from "zustand/vanilla";

interface IGenSceneProp extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    storeGen: {
        (): ExtractState<StoreApi<IStoreGen>>,
        <U>(selector: (state: ExtractState<StoreApi<IStoreGen>>) => U): U
    } & StoreApi<IStoreGen>;
    title?: string;
    titleAddNew?: string;
}

const GenScene: React.FC<IGenSceneProp> = ({className, storeGen, title, titleAddNew, ...rest}) => {

    const [props, setProps] = useState<IMapProp>({desc: '', title: '', text: '', type: null})

    const {
        addGen,
        addGenProp,
        arrGen,
        deleteGen,
        deleteGenProp,
        updateGenName,
        updateGenProp
    } = storeGen(
        useShallow((state) => ({
            arrGen: state.arrGen,
            addGen: state.addGen,
            updateGenName: state.updateGenName,
            updateGenProp: state.updateGenProp,
            addGenProp: state.addGenProp,
            deleteGen: state.deleteGen,
            deleteGenProp: state.deleteGenProp
        }))
    );


    const {isHide} = useStoreFolding();

    const arrExclude = ['name', 'id'];

    let dialogContent: React.ReactElement = <Col noBorder={true}>
        <div>Имя</div>
        <TextInput value={props.title} placeholder="Введите имя" className="st-air-tx-imp mb-2"
                   onChange={(e: any) => setProps(state => ({...state, title: e.target.value}))}/>

        <div>Описание</div>
        <TextWrite value={props.desc} placeholder="Введите описание" fitToTextSize={true} className="st-air-tx-imp"
                   onChange={(e: any) => setProps(state => ({...state, desc: e.target.value}))}/>

    </Col>

    // useEffect(() => {
    //     console.log(props)
    // }, [props]);

    return <Col role="scenes-gen" noBorder={true} className={clsx(className, "h-full", "bg-white")}>
        <Row role="scenes-menu">
            <ButtonEx className={clsx("bi-plus-circle")} title={titleAddNew} onClick={() => addGen()}/>
        </Row>

        {arrGen.map(((scene, iScene) => {
            const {id, name, arrMapProp} = scene;
            return <Col key={iScene} noBorder={true}>
                <Row role="scene-menu">
                    <Group>
                        <SwitchHide id={id}/>
                        <ButtonEx className={clsx("bi-plus-circle")} title="Добавить новое свойство"
                                  description="Добавить новое свойство"
                                  onClick={() => setProps({title: '', desc: ''})}
                                  onConfirm={() => addGenProp(iScene, props)} dialogContent={dialogContent}/>
                        <ButtonDelete onDelete={() => deleteGen(iScene)}/>
                    </Group>
                    <TextInput value={name} placeholder={title}
                               onChange={(e: any) => updateGenName(iScene, e.target.value)}/>
                </Row>
                {!isHide(id) && <div className="pl-1 flex flex-wrap gap-1">
                    {arrMapProp.map((mapProp, iProp) => {
                        const {title, desc, type, text} = mapProp;
                        return !arrExclude.includes(name) &&
                            <Col role="scene-prop" key={iProp} className="w-[33%] !gap-0">
                                <Row className="text-black/60">
                                    <Tooltip text={desc} className="bi-info-circle  leading-6"/>
                                    <ButtonEx className={clsx("bi-pencil", 'text-sm')} title="Редактировать свойство"
                                              description="Редактировать свойство"
                                              data-key={iProp}
                                              onClick={(e) => {
                                                  const index = +((e.target as HTMLElement).parentNode as HTMLElement).dataset.key;
                                                  setProps(arrMapProp[index])
                                              }}
                                              onConfirm={() => updateGenProp(iScene, iProp, props)}
                                              dialogContent={dialogContent}/>
                                    <div className="leading-6 w-full">{title}</div>
                                    <ButtonDelete onDelete={() => {
                                        deleteGenProp(iScene, iProp)
                                    }}/>
                                </Row>
                                <TextWrite
                                    className="w-full border-none st-air-tx-imp" fitToTextSize={true}
                                    placeholder={desc}
                                    value={text}
                                    onChange={(e: any) => updateGenProp(iScene, iProp, {text: e.target.value})}/>
                            </Col>
                    })}
                </div>}
            </Col>

        }))}

    </Col>;
};

export default memo(GenScene);