import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../../Auxiliary/ButtonEx.tsx";
import clsx from "clsx";
import {useStoreBook} from "../../Stores/storeBook.ts";
import {useStoreState} from "../../Stores/storeAux.ts";
import {Col, Row, SwitchButton, Text} from "../Auxiliary.tsx";
import {IScene} from "../../types.ts";
import Group from "../../../Auxiliary/Group.tsx";

interface IItemsProps {
    iPart: number;
    iChapter: number;
    iScene: number;
    scene: IScene;
}

const Items = ({iPart, iChapter, iScene, scene}: IItemsProps) => {
    const {id, aim, arrItemID, arrCharacterID, arrEvent} = scene;

    const {isState} = useStoreState();
    const addItem = useStoreBook(state => state.addItem);
    const updateItem = useStoreBook(state => state.updateItem);
    const deleteItem = useStoreBook(state => state.deleteItem);

    return <Col role="items" className="" noBorder={true}>
        <Row role="menu-items">
            <Group>
                <SwitchButton id={id + 'si'}/>
                <ButtonEx className={clsx("bi-box")} title="Добавить предмет/сущность"
                          onClick={() => addItem(iPart, iChapter, iScene)}/>
            </Group>
            <Text>Предметы</Text>
        </Row>
        {!isState(id + 'si') && arrItemID.map(({id, itemID}, iItem) =>
            <Row key={iItem}>
                {/*Drop item*/}
                {id} {itemID}
            </Row>)}
    </Col>
};

export default memo(Items);