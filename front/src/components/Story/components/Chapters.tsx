import React, {memo} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../Auxiliary/ButtonEx.tsx";
import clsx from "clsx";
import {useStoreBook} from "../Stores/storeBook.ts";
import {useStoreFolding} from "../Stores/storeAux.ts";
import {ButtonDelete, Col, Row, SwitchHide, Text} from "./Auxiliary.tsx";
import {IChapter} from "../types.ts";
import Scenes from "./Scene/Scenes.tsx";
import Group from "../../Auxiliary/Group.tsx";

interface IChaptersProps {
    iPart: number;
    arrChapter: IChapter[];
}

const Chapters = ({iPart, arrChapter}: IChaptersProps) => {

    const {isHide} = useStoreFolding()
    const addScene = useStoreBook(state => state.addScene);
    const deleteChapter = useStoreBook(state => state.deleteChapter);
    const updateChapter = useStoreBook(state => state.updateChapter);

    return arrChapter.map((chapter, iChapter) => {
        const {id, name, arrScene} = chapter as IChapter;
        return <Col role="chapters" noBorder={true} key={iChapter} className="">
            <Row role="menu-chapter">
                <Group>
                    <SwitchHide id={id}/>
                    <ButtonEx className={clsx("bi-plus-circle")} title="Добавить сцену"
                              onClick={() => addScene(iPart, iChapter)}/>
                    <ButtonDelete onDelete={() => deleteChapter(iPart, iChapter)}/>
                </Group>
                <Text>Глава {iChapter + 1}.</Text>
                <input type="text" value={name} placeholder="Введите название" className="grow"
                       onChange={({target}) => updateChapter(iPart, iChapter, {name: target.value})}/>
            </Row>
            {!isHide(id) && <Col noBorder={true} className="ml-1">
                <Scenes iPart={iPart} iChapter={iChapter} arrScene={arrScene}/>
            </Col>}
        </Col>
    })
}


export default memo(Chapters);