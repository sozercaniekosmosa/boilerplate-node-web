import React, {Dispatch, memo, SetStateAction, useState} from 'react';
import clsx from "clsx";
import {ButtonDelete, Col, Row, SwitchButton, Text, TextInput} from "./components/Auxiliary.tsx";
import ButtonEx from "../Auxiliary/ButtonEx.tsx";
import Group from "../Auxiliary/Group.tsx";
import {useStoreState} from "./Stores/storeAux.ts";
import {IMapProp, IStoreGen} from "./types.ts";
import TextWrite from "../Auxiliary/TextWrite.tsx";
import {Tooltip} from "../Auxiliary/Tooltip.tsx";
import {useShallow} from "zustand/react/shallow";
import {ExtractState, StoreApi} from "zustand/vanilla";
import {useStoreBook} from "./Stores/storeBook.ts";

let sectionName = "";

interface IDialogContentProps {
    props: IMapProp;
    setProps: Dispatch<SetStateAction<IMapProp>>;
}

interface IGenSceneProp extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    storeGen: {
        (): ExtractState<StoreApi<IStoreGen>>,
        <U>(selector: (state: ExtractState<StoreApi<IStoreGen>>) => U): U
    } & StoreApi<IStoreGen>;
    title?: string;
    titleAddNew?: string;
}

interface IPropertyProps extends React.HTMLAttributes<Element> {
    iScene: number,
    iProp: number,
    props: IMapProp,
    setProps: Dispatch<SetStateAction<IMapProp>>,
    storeGen: {
        (): ExtractState<StoreApi<IStoreGen>>,
        <U>(selector: (state: ExtractState<StoreApi<IStoreGen>>) => U): U
    } & StoreApi<IStoreGen>;
}

const PropertyHeader = ({iProp, setProps, iScene, props, storeGen, children, className}: IPropertyProps) => {

    const {arrGen, deleteGenProp, updateGenProp} = storeGen(
        useShallow((state) => ({arrGen: state.arrGen, updateGenProp: state.updateGenProp, deleteGenProp: state.deleteGenProp}))
    );

    let arrMapProp = arrGen[iScene].arrMapProp;
    const {title, desc, isChange} = arrMapProp[iProp];

    return <Col role="scene-prop-content" key={iProp} className={clsx("bg-white w-[33%] !gap-0", className)}>
        <Row className="text-black/60">
            <Tooltip text={desc} className="bi-info-circle leading-6"/>
            <ButtonEx
                title="Изменяемое свойство"
                className={clsx(
                    !isChange ? "bi-toggle-off" : "bi-toggle-on",
                    'ml-1 !p-0 text-[1.4rem]'
                )}
                onClick={() => updateGenProp(iScene, iProp, {isChange: !isChange})}/>
            <ButtonEx className={clsx("bi-pencil", 'text-sm')} title="Редактировать свойство"
                      description="Редактировать свойство"
                      data-key={iProp}
                      onClick={(e) => {
                          const index = +((e.target as HTMLElement).parentNode as HTMLElement).dataset.key;
                          setProps(arrMapProp[index])
                      }}
                      onConfirm={() => updateGenProp(iScene, iProp, props)}
                      dialogContent={DialogContent({props, setProps})}/>
            <div className="w-full select-none truncate">{title}</div>
            <ButtonDelete onDelete={() => {
                deleteGenProp(iScene, iProp)
            }}/>
        </Row>
        {children}
    </Col>;
}

let DialogContent = ({props, setProps}: IDialogContentProps) => <Col noBorder={true}>
    <div>Имя</div>
    <TextInput value={props.title} placeholder=" Введите имя" className=" st-air-tx-imp mb-2"
               onChange={(e: any) => setProps(state => ({...state, title: e.target.value}))}/>

    <div>Описание</div>
    <TextWrite value={props.desc} placeholder=" Введите описание" fitToTextSize={true} className=" st-air-tx-imp"
               onChange={(e: any) => setProps(state => ({...state, desc: e.target.value}))}/>
</Col>

const Generator: React.FC<IGenSceneProp> = ({className, storeGen, title, titleAddNew, ...rest}) => {

    const [props, setProps] = useState<IMapProp>({desc: '', title: '', value: '', section: false, list: [], ext: true})

    const {addGen, addGenProp, arrGen, deleteGen, updateGenName, updateGenProp} = storeGen(useShallow((state) => ({
            arrGen: state.arrGen, addGen: state.addGen, updateGenName: state.updateGenName, updateGenProp: state.updateGenProp,
            addGenProp: state.addGenProp, deleteGen: state.deleteGen
        }))
    );
    const execByID = useStoreBook(useShallow(state => state.execByID))

    const {isState, setState} = useStoreState();

    return <Col role="scenes-gen" noBorder={true} className={clsx(className, " h-full", " bg-white")}>
        <Row role="scenes-menu">
            <ButtonEx className={clsx(" bi-plus-circle")} title={titleAddNew} onClick={() => addGen()}/>
            <Text className=" w-full"></Text>
            <ButtonEx className="bi-chevron-expand" title="Развернуть все"
                      onClick={() => arrGen.map(({id, arrMapProp}) => {
                          setState(id, false);
                          arrMapProp[0].section && arrMapProp.map(({title}) => setState(id + title, false))
                      })}/>
            <ButtonEx className="bi-chevron-contract" title="Свернуть все"
                      onClick={() => arrGen.map(({id, arrMapProp}) => {
                          setState(id, true);
                          arrMapProp[0].section && arrMapProp.map(({title}) => setState(id + title, true))
                      })}/>
        </Row>
        {arrGen.map(((scene, iScene) => {
            const {id, name, arrMapProp} = scene;
            const {desc, ext, isChange, list, range, section, value} = arrMapProp[iScene];

            let extend = false;
            const lastIndex = arrMapProp.length - 1;

            sectionName = "";


            return <Col role="scene-props" key={iScene} className="bg-gray-200">
                <Row role="scene-props-menu">
                    <Group>
                        <SwitchButton id={id}/>
                        <ButtonEx className={clsx("bi-plus-circle")} title="Добавить новое свойство"
                                  description="Добавить новое свойство"
                                  onClick={() => setProps({desc: '', title: '', value: '', isChange: false})}
                                  onConfirm={() => addGenProp(iScene, props)} dialogContent={DialogContent({props, setProps})}/>
                        <ButtonDelete onDelete={() => {
                            execByID(id, (arr, i) => arr.splice(i, 1));
                            deleteGen(iScene);
                        }}/>
                    </Group>
                    <TextInput value={name} placeholder={title} className="st-air-tx-imp"
                               onChange={(e: any) => updateGenName(iScene, e.target.value)}/>
                    {arrMapProp[0].section && <ButtonEx className="bi-chevron-expand" title="Развернуть все"
                                                        onClick={() => {
                                                            !isState(id) && arrMapProp.map(({title}) => setState(id + title, false));
                                                            setState(id, false);
                                                        }}/>}
                    {arrMapProp[0].section && <ButtonEx className="bi-chevron-contract" title="Свернуть все"
                                                        onClick={() => {
                                                            isState(id + arrMapProp[0].title) && setState(id, true);
                                                            arrMapProp.map(({title}) => setState(id + title, true));
                                                        }}/>}
                </Row>
                {!isState(id) && <div className="pl-3 flex flex-wrap gap-0.5">
                    {arrMapProp.map((mapProp, iProp) => {
                        const {title, desc, section, value, ext, list, range} = mapProp;

                        if (section && iProp && iProp == lastIndex) return null;
                        if (section) {
                            extend = !!ext;
                            sectionName = id + title;
                            return <Row role="scene-prop-menu" className="w-full" key={iProp}>
                                <SwitchButton id={sectionName}/>
                                <Text>{title}</Text>
                                {!isState(sectionName) && title != 'Дополнительные' &&
                                    <ButtonEx
                                        title="Изменяемое свойство"
                                        className={clsx(
                                            !ext ? "bi-toggle-off" : "bi-toggle-on",
                                            'ml-1 !p-0 text-[1.4rem]'
                                        )}
                                        onClick={() => {
                                            updateGenProp(iScene, iProp, {ext: !ext})
                                        }}/>}
                            </Row>
                        }

                        if (sectionName && isState(sectionName)) return null;
                        if (!section && extend == false && ext) return null;

                        if (range) {
                            const [from, max] = range;

                            return (
                                <PropertyHeader key={iProp} iScene={iScene} iProp={iProp} props={props} setProps={setProps}
                                                storeGen={storeGen}>
                                    <input form={from + ''} max={max} className="mx-1" type="range"
                                           value={value != '' ? +value : 5}
                                           onChange={(e) => updateGenProp(iScene, iProp, {value: e.target.value})}
                                    />
                                    <Text className="text-center">{!value ? 5 : value}</Text>
                                </PropertyHeader>)
                        }

                        if (list) {
                            let mm = value ? value.split(', ') : [];
                            return (
                                <PropertyHeader key={iProp} iScene={iScene} iProp={iProp} props={props} setProps={setProps}
                                                storeGen={storeGen}
                                                className="">
                                    <div className="flex flex-wrap">
                                        {list.map((it, i) =>
                                            <ButtonEx key={i}
                                                      className={clsx(
                                                          mm.includes(it) ? 'bi-check-square' : 'bi-square',
                                                          'w-[50%] justify-start'
                                                      )}
                                                      onClick={() => {
                                                          const m = mm.indexOf(it)
                                                          if (~m) {
                                                              mm.splice(m, 1)
                                                          } else {
                                                              mm.push(it)
                                                          }
                                                          updateGenProp(iScene, iProp, {value: mm.join(', ')})
                                                      }
                                                      }>
                                                <div className="pl-1 truncate">{it}</div>
                                            </ButtonEx>
                                        )}
                                    </div>
                                </PropertyHeader>)
                        }

                        return <PropertyHeader
                            key={iProp} iScene={iScene} iProp={iProp}
                            props={props} setProps={setProps} storeGen={storeGen}>
                            <TextWrite
                                className="w-full border-none st-air-tx-imp" fitToTextSize={true}
                                placeholder={desc}
                                value={value}
                                onChange={(e: any) => updateGenProp(iScene, iProp, {value: e.target.value})}/>
                        </PropertyHeader>
                    })}
                </div>}

            </Col>

        }))}

    </Col>;
};

export default memo(Generator);