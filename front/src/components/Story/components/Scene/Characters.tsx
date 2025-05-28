import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../../Auxiliary/ButtonEx.tsx";
import clsx from "clsx";
import {useStoreBook} from "../../Stores/storeBook.ts";
import {useStoreFolding} from "../../Stores/storeAux.ts";
import {Col, Row, SwitchHide, Text} from "../Auxiliary.tsx";
import Group from "../../../Auxiliary/Group.tsx";
import {useStoreGenCharacter} from "../../Stores/storeGenerators.ts";
import DropdownButton from "../../../Auxiliary/DropdownButton.tsx";

export const Characters = ({iPart, iChapter, iScene, scene}) => {
    const {id, name, arrItem, arrCharacter, arrEvent} = scene;

    const {isHide} = useStoreFolding();
    const addCharacter = useStoreBook(state => state.addCharacter);
    const updateCharacter = useStoreBook(state => state.updateCharacter);
    const deleteCharacter = useStoreBook(state => state.deleteCharacter);
    const arrGenCharacter = useStoreGenCharacter(state => state.arrGen);

    return <Col role="characters" className="" noBorder={true}>
        <Row role="menu-characters">
            <Group>
                <SwitchHide id={id + 'sc'}/>
                <ButtonEx className={clsx("bi-person-fill")} title="Добавить персонажа"
                          onClick={() => addCharacter(iPart, iChapter, iScene)}/>
                <DropdownButton title="">
                    <div className="py-3 *:hover:bg-gray-500/50 *:px-3 *:p-1 *:cursor-pointer"
                         onClick={(e: any) => 0 /*updateScene(iPart, iChapter, iScene, {sceneID: arrGenScene[e.target.dataset.key].id})*/}>
                        {arrGenCharacter.map((GenCharacter, i) => <div key={i} data-key={i}>{GenCharacter.name}</div>)}
                    </div>
                </DropdownButton>
            </Group>
            <Text>Персонажи</Text>
        </Row>
        {!isHide(id + 'sc') && arrCharacter.map(({id, name}: any, iCharacter: React.Key) =>
            <Row key={iCharacter}>
                {/*Drop character*/}
                {/*Prop character*/}
                {id} {name}
            </Row>)}
    </Col>
        ;
}

export default memo(Characters);