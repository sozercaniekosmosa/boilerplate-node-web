import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../../Auxiliary/ButtonEx.tsx";
import clsx from "clsx";
import {useStoreBook} from "../../Stores/storeBook.ts";
import {useStoreFolding} from "../../Stores/storeAux.ts";
import {Col, Row, SwitchHide, Text} from "../Auxiliary.tsx";
import Group from "../../../Auxiliary/Group.tsx";

export const Characters = ({iPart, iChapter, iScene, scene}) => {
    const {id, name, arrItem, arrCharacter, arrEvent} = scene;

    const {isHide} = useStoreFolding();
    const addCharacter = useStoreBook(state => state.addCharacter);
    const updateCharacter = useStoreBook(state => state.updateCharacter);
    const deleteCharacter = useStoreBook(state => state.deleteCharacter);

    return <Col role="characters" className="" noBorder={true}>
        <Row role="menu-characters">
            <Group>
                <SwitchHide id={id + 'sc'}/>
                <ButtonEx className={clsx("bi-person-fill")} title="Добавить персонажа"
                          onClick={() => addCharacter(iPart, iChapter, iScene)}/>
            </Group>
            <Text>Персонажи</Text>
        </Row>
        {!isHide(id + 'sc') && arrCharacter.map(({id, name}: any, iCharacter: React.Key) =>
            <Row key={iCharacter}>
                {/*Drop character*/}
                {/*Prop character*/}
                {id} {name}
            </Row>)}
    </Col>;
}

export default memo(Characters);