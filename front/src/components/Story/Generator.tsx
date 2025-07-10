import React, {Dispatch, memo, SetStateAction, useState} from 'react';
import clsx from "clsx";
import {ButtonDelete, ChangeFontSize, Col, Row, SwitchButton, Text, TextInput} from "./components/Auxiliary.tsx";
import ButtonEx from "../Auxiliary/ButtonEx.tsx";
import Group from "../Auxiliary/Group.tsx";
import {useStoreState} from "./Stores/storeAux.ts";
import {IMap, IMapProp, IStoreGen} from "./types.ts";
import TextWrite from "../Auxiliary/TextWrite.tsx";
import {Tooltip} from "../Auxiliary/Tooltip.tsx";
import {useShallow} from "zustand/react/shallow";
import {ExtractState, StoreApi} from "zustand/vanilla";
import {useStoreBook} from "./Stores/storeBook.ts";
import {template} from "../../lib/strings.ts";
import axios from "axios";
import glob from "../../glob.ts";

import DropdownButton from "../Auxiliary/DropdownButton.tsx";
import {
    promptTaskChange,
    promptTaskInverseMeaning, promptTaskLessQuality, promptTaskLessQuantity,
    promptTaskLessText, promptTaskMoreQuality,
    promptTaskMoreQuantity,
    promptTaskMoreText
} from "./Prompts/genPrompts.tsx";

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
    prompt?: string;
}

interface IPropertyProps extends React.HTMLAttributes<Element> {
    index: number,
    iProp: number,
    props: IMapProp,
    setProps: Dispatch<SetStateAction<IMapProp>>,
    storeGen: {
        (): ExtractState<StoreApi<IStoreGen>>,
        <U>(selector: (state: ExtractState<StoreApi<IStoreGen>>) => U): U
    } & StoreApi<IStoreGen>;
}

export async function toGPT(promptCmd = null, textContent?: string) {
    // textContent = glob.selectedText ?? textContent;
    try {
        const {data: text} = await axios.post(glob.hostAPI + 'gpt', {
            text: textContent,
            prompt: promptCmd ?? prompt
        });

        return text;
    } catch (e) {
        console.log(e)
        return null;
    }
}

const PropertyHeader = ({iProp, setProps, index, props, storeGen, children, className}: IPropertyProps) => {

    const [stateGPT, setStateGPT] = useState(0);

    const {arrGen, deleteGenProp, updateGenProp} = storeGen(
        useShallow((state) => ({
            arrGen: state.arrGen,
            updateGenProp: state.updateGenProp,
            deleteGenProp: state.deleteGenProp
        }))
    );

    let {arrMapProp, desc: descGeneral} = arrGen[index];
    const {title, desc, isVisible, value} = arrMapProp[iProp];

    // const data = arrMapProp.map(({value}) => value).join(' ');
    const addingProps = arrMapProp.filter(({title}) => title.toLowerCase().startsWith('пол') || title.toLowerCase().includes('возраст'))
        .map(({title, value}) => title + ': ' + value).join(', ')

    const rewriteGPT = async (prompt: string) => {
        setStateGPT(1);
        let countWords = value.split(' ').length;
        const promptBuild = template(prompt, {
            /*@ts-ignore*/
            value: value.replaceAll(/[\r\n]/g, ''),
            halfWords: Math.trunc(countWords * .5),
            x2Words: countWords * 2,
            title,
            desc,
            /*@ts-ignore*/
            general: (descGeneral + ', ' + addingProps).toLowerCase().replaceAll(/[\r\n]/g, '')
        });

        console.log(promptBuild);
        let _value = (await toGPT(promptBuild));
        if (_value == null) {
            setStateGPT(2);
            return;
        }
        _value = _value.replaceAll(/[*]|\s{2,}/g, '')
        updateGenProp(index, iProp, {value: _value})
        setStateGPT(0);
    };

    return <Col role="scene-prop-content" key={iProp} className={clsx("bg-white w-[33%] !gap-0", className)}>
        <Row className="text-black/60">
            <Tooltip text={desc} className="bi-info-circle leading-6"/>
            <ButtonEx
                title="Изменяемое свойство"
                className={clsx(
                    !isVisible ? "bi-toggle-off" : "bi-toggle-on",
                    'ml-1 !p-0 text-[1.4rem]'
                )}
                onClick={() => updateGenProp(index, iProp, {isVisible: !isVisible})}/>
            <ButtonEx className={clsx("bi-pencil", 'text-sm')} title="Редактировать свойство"
                      description="Редактировать свойство"
                      data-key={iProp}
                      onClick={(e) => {
                          const index = +((e.target as HTMLElement).parentNode as HTMLElement).dataset.key;
                          setProps(arrMapProp[index])
                      }}
                      onConfirm={() => updateGenProp(index, iProp, props)}
                      dialogContent={DialogContent({props, setProps})}/>
            <div className="w-full select-none truncate">{title}</div>
            {/*<Row className="hover:!opacity-100 opacity-0 transition-all duration-500">*/}
            <DropdownButton role="change-type" title="" className={clsx("h-full bi-stars", stateGPT == 2 ? 'st-danger' : '')}
                            isSpinner={stateGPT == 1}>
                <div className={clsx(
                    'h-auto flex flex-col items-center justify-center',
                    'p-1',
                    "*:cursor-pointer w-auto",
                    "rounded-sm shadow-xl/20",
                    "bg-white ring-1 ring-gray-500/50 !gap-1",
                )}>
                    <Row>
                        <ButtonEx title="Переписать" className="!p-1 text-[1.1rem] bi-arrow-repeat" dir="left"
                                  onClick={() => rewriteGPT(promptTaskChange)}/>
                        <ButtonEx title="Инвертировать смысл" className="!p-1 bi-circle-half" dir="left"
                                  onClick={() => rewriteGPT(promptTaskInverseMeaning)}/>
                    </Row>
                    <Row>
                        <ButtonEx title="Расширить текст" className="!p-1 bi-arrows-angle-expand" dir="left"
                                  onClick={() => rewriteGPT(promptTaskMoreText)}/>
                        <ButtonEx title="Сжать текст" className="!p-1 bi-arrows-angle-contract" dir="left"
                                  onClick={() => rewriteGPT(promptTaskLessText)}/>
                    </Row>
                    <Row>
                        <ButtonEx title="Увеличить количественную характеристику" className="!p-1 bi-zoom-in" dir="left"
                                  onClick={() => rewriteGPT(promptTaskMoreQuantity)}/>
                        <ButtonEx title="Уменьшить количественную характеристику" className="!p-1 bi-zoom-out" dir="left"
                                  onClick={() => rewriteGPT(promptTaskLessQuantity)}/>
                    </Row>
                    <Row>
                        <ButtonEx title="Улучшить качественную характеристику" className="!p-1 bi-emoji-smile" dir="left"
                                  onClick={() => rewriteGPT(promptTaskMoreQuality)}/>
                        <ButtonEx title="Ухудшить качественную характеристику" className="!p-1 bi-emoji-frown" dir="left"
                                  onClick={() => rewriteGPT(promptTaskLessQuality)}/>
                    </Row>

                </div>
            </DropdownButton>
            <ButtonDelete onDelete={() => {
                deleteGenProp(index, iProp)
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

const Generator: React.FC<IGenSceneProp> = ({className, storeGen, title, titleAddNew, prompt, ...rest}) => {

    const [props, setProps] = useState<IMapProp>({desc: '', title: '', value: '', section: false, list: [], ext: true})

    const {addGen, addGenProp, arrGen, deleteGen, updateGen, updateGenProp} = storeGen(useShallow((state) => ({
            arrGen: state.arrGen,
            addGen: state.addGen,
            updateGen: state.updateGen,
            updateGenProp: state.updateGenProp,
            addGenProp: state.addGenProp,
            deleteGen: state.deleteGen
        }))
    );
    const execByID = useStoreBook(useShallow(state => state.execByID))

    const {isState, setState} = useStoreState();

    return <Col role="scenes-gen" noBorder={true} className={clsx(className, " h-full", " bg-white")}
                id={'gen.' + title + ':fs'}>
        <Row role="scenes-menu">
            <ButtonEx className={clsx("bi-plus-circle")} title={titleAddNew} onClick={() => addGen()}/>
            <ChangeFontSize id={'gen.' + title + ':fs'}/>
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
        {arrGen.map(((gen, index) => {
            const {arrMapProp, id, name, desc} = gen as IMap;
            const {ext, isVisible, list, range, section, value} = arrMapProp[index];

            let extend = false;
            const lastIndex = arrMapProp.length - 1;

            sectionName = "";
            return <Col role="scene-props" key={index} className="bg-gray-200">
                <Row role="scene-props-menu" className="">
                    <Group>
                        <SwitchButton id={id}/>
                        <ButtonEx className={clsx("bi-plus-circle")} title="Добавить новое свойство"
                                  description="Добавить новое свойство"
                                  onClick={() => setProps({desc: '', title: '', value: '', isVisible: false})}
                                  onConfirm={() => addGenProp(index, props)}
                                  dialogContent={DialogContent({props, setProps})}/>
                        <ButtonDelete onDelete={() => {
                            execByID(id, (arr, i) => arr.splice(i, 1));
                            deleteGen(index);
                        }}/>
                        <ButtonEx className="bi-eraser-fill"
                                  description="Очистить"
                                  onConfirm={() => {
                                      for (let i = 0; i < arrMapProp.length; i++) {
                                          updateGenProp(index, i, {value: ''});
                                      }
                                  }}
                        ></ButtonEx>
                    </Group>
                    <TextInput value={name} placeholder={title}
                               className="st-air-tx-imp !rounded-none border-r-1 border-b-1 border-black/5"
                               onChange={(e: any) => updateGen(index, {name: e.target.value} as IMap)}/>
                    <TextInput value={desc} placeholder="Общее описание"
                               className="st-air-tx-imp !rounded-none border-r-1 border-b-1 border-black/5"
                               onChange={(e: any) => updateGen(index, {desc: e.target.value} as IMap)}

                    />
                    <ButtonEx className="bi-stars" title="Сгенерировать" onAction={async () => {
                        const arrStruct =
                            arrMapProp.filter(it => it?.section ? null : it).map(({desc, value}) => ({desc, value}))
                        const struct = JSON.stringify(arrStruct)
                        const promptBuild = prompt ? template(prompt, {desc, struct}) : '';

                        const arrMapPropGptData = (await toGPT(promptBuild));
                        if (arrMapPropGptData == null) return 2;
                        let iProp = 0;
                        for (let i = 0; i < arrMapProp.length; i++) {
                            if (!arrMapProp[i]?.section) {
                                if (Array.isArray(arrMapPropGptData)) {
                                    updateGenProp(index, i, {value: arrMapPropGptData[iProp].value});
                                    iProp++
                                } else {
                                    return 2;
                                }
                            }
                        }

                        return 0;
                        // console.log(promptBuild)
                    }} disabled={!desc || desc?.length == 0}/>
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
                        const {title, desc, section, value, ext, list, range, disabledExt} = mapProp;

                        if (section && iProp && iProp == lastIndex) return null;
                        if (section) {
                            extend = !!ext;
                            sectionName = id + title;
                            return <Row role="scene-prop-menu" className="w-full" key={iProp}>
                                <SwitchButton id={sectionName}/>
                                <Text>{title}</Text>
                                {!isState(sectionName) && !disabledExt && title != 'Дополнительные' &&
                                    <ButtonEx
                                        title="Дополнительные"
                                        className={clsx(
                                            !ext ? "bi-toggle-off" : "bi-toggle-on",
                                            'ml-1 !p-0 text-[1.4rem]'
                                        )}
                                        onClick={() => {
                                            updateGenProp(index, iProp, {ext: !ext})
                                        }}/>}
                            </Row>
                        }

                        if (sectionName && isState(sectionName)) return null;
                        if (!section && extend == false && ext) return null;

                        if (range) {
                            const [from, max] = range;

                            return (
                                <PropertyHeader key={iProp} index={index} iProp={iProp} props={props}
                                                setProps={setProps}
                                                storeGen={storeGen}>
                                    <input form={from + ''} max={max} className="mx-1" type="range"
                                           value={value != '' ? +value : 5}
                                           onChange={(e) => updateGenProp(index, iProp, {value: e.target.value})}
                                    />
                                    <Text className="text-center">{!value ? 5 : value}</Text>
                                </PropertyHeader>)
                        }

                        if (list) {
                            let mm = value ? value.split(', ') : [];
                            return (
                                <PropertyHeader key={iProp} index={index} iProp={iProp} props={props}
                                                setProps={setProps}
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
                                                          updateGenProp(index, iProp, {value: mm.join(', ')})
                                                      }
                                                      }>
                                                <div className="pl-1 truncate">{it}</div>
                                            </ButtonEx>
                                        )}
                                    </div>
                                </PropertyHeader>)
                        }

                        return <PropertyHeader
                            key={iProp} index={index} iProp={iProp}
                            props={props} setProps={setProps} storeGen={storeGen}>
                            <TextWrite
                                className="w-full border-none st-air-tx-imp" fitToTextSize={true}
                                placeholder={desc}
                                value={value}
                                onChange={(e: any) => updateGenProp(index, iProp, {value: e.target.value})}/>
                        </PropertyHeader>
                    })}
                </div>}

            </Col>

        }))}

    </Col>;
};

export default memo(Generator);