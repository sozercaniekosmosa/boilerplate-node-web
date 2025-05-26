import React, {memo} from 'react';
import clsx from "clsx";
import {ButtonDelete, Col, Row, SwitchHide, Text, TextInput} from "./components/Auxiliary.tsx";
import ButtonEx from "../Auxiliary/ButtonEx.tsx";
import Group from "../Auxiliary/Group.tsx";
import {useStoreCharacterGen, useStoreScenesGen} from "./Stores/storeGenerators.ts";
import {useStoreFolding} from "./Stores/storeAux.ts";
import {arrMapOfCharacter, arrMapOfScene} from "./maps.ts";
import {ICharacterGen, ISceneGen} from "./types.ts";
import TextWrite from "../Auxiliary/TextWrite.tsx";
import {Tooltip} from "../Auxiliary/Tooltip.tsx";

interface ICharacterGenProp extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const CharacterGen: React.FC<ICharacterGenProp> = ({className, ...rest}) => {

    const arrCharacterGen = useStoreCharacterGen(state => state.arrCharacterGen);
    const addCharacterGen = useStoreCharacterGen(state => state.addCharacterGen);
    const updateCharacterGen = useStoreCharacterGen(state => state.updateCharacterGen);
    const deleteCharacterGen = useStoreCharacterGen(state => state.deleteCharacterGen);
    const {isHide} = useStoreFolding();
    const arrExclude = ['name', 'id'];

    return <Col role="character-gen" noBorder={true} className={clsx(className, "h-full", "bg-white")}>
        <Row role="character-menu">
            <ButtonEx className={clsx("bi-plus-circle")} title="Добавить нового персонажа"
                      onClick={() => addCharacterGen()}/>
            <Text>Создать персонажа</Text>
        </Row>

        {arrCharacterGen.map(((character, iCharacter) => {
            const {id} = character as ICharacterGen;
            return <Col key={iCharacter} noBorder={true}>
                <Row role="character-menu">
                    <Group>
                        <SwitchHide id={id}/>
                        <ButtonDelete onDelete={() => deleteCharacterGen(iCharacter)}/>
                    </Group>
                    <TextInput value={arrCharacterGen[iCharacter].name} placeholder="Имя персонажа"
                               onChange={(e: any) => updateCharacterGen(iCharacter, {'name': e.target.value} as ICharacterGen)}/>
                </Row>
                {!isHide(id) && <div className="pl-1 flex flex-wrap gap-1">
                    {arrMapOfCharacter.map(({name, title, desc}, i) => {
                        return !arrExclude.includes(name) &&
                            <Col role="character-item" key={i} className="w-[33%] !gap-0">
                                <Row className="text-black/60">
                                    <Tooltip text={desc} className="bi-info-circle"/>
                                    {title}
                                </Row>
                                <TextWrite
                                    className="w-full border-none" fitToTextSize={true} placeholder={title}
                                    value={arrCharacterGen[iCharacter][name]}
                                    onChange={(e: any) => updateCharacterGen(iCharacter, {[name]: e.target.value} as ICharacterGen)}/>
                            </Col>
                    })}
                </div>}
            </Col>

        }))}

    </Col>;
};

export default memo(CharacterGen);