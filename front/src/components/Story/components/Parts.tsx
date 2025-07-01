import React, {memo, useEffect} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../Auxiliary/ButtonEx.tsx";
import clsx from "clsx";
import {useStoreBook} from "../Stores/storeBook.ts";
import {useStoreState} from "../Stores/storeAux.ts";
import {ButtonDelete, ChangeFontSize, Col, Row, SwitchButton, Text, TextInput} from "./Auxiliary.tsx";
import Chapters from "./Chapters.tsx";
import Group from "../../Auxiliary/Group.tsx";

const Parts = ({className = ''}) => {

    const updateListID = useStoreBook(state => state.updateListIDDebounce);
    const name = useStoreBook(state => state.name);
    const setName = useStoreBook(state => state.setName);
    const arrPart = useStoreBook(state => state.arrPart);
    const addPart = useStoreBook(state => state.addPart);
    const updatePart = useStoreBook(state => state.updatePart);
    const deletePart = useStoreBook(state => state.deletePart);
    const addChapter = useStoreBook(state => state.addChapter);
    const {isState, listState, setState} = useStoreState();

    useEffect(() => {
        useStoreBook.getState().getData().then(() => {
        });
        updateListID();
        // @ts-ignore
        window.useStoreBook = useStoreBook;
    }, []);

    return <Col role="parts" noBorder={true} className={clsx(className, "h-full", "bg-white")} id="gen:fs">
        <ChangeFontSize id={'gen:fs'}/>
        <Row role="menu-book">
            <ButtonEx className={clsx("bi-plus-circle")} title="Добавить часть" onClick={() => addPart()}/>
            <Text>Книга:</Text>
            <TextInput value={name} className="grow" placeholder="Введите название"
                       onChange={({target}) => setName(target.value)}/>
        </Row>
        {arrPart.map(((part, iPart) => {
            const {id, name, arrChapter} = part;
            return <Col role="menu-part" noBorder={true} key={iPart}>
                <Row>
                    <Group>
                        <SwitchButton id={id}/>
                        <ButtonEx className={clsx("bi-plus-circle")} title="Добавить главу"
                                  onClick={() => addChapter(iPart)}/>
                    </Group>
                    <Text className="text-nowrap">Часть {iPart + 1}.</Text>
                    <TextInput value={name} placeholder="Введите название"
                               onChange={({target}) => updatePart(iPart, {name: target.value})}/>
                    <ButtonDelete onDelete={() => deletePart(iPart)}/>
                </Row>
                {!isState(id) && <Col noBorder={true} className="ml-1">
                    <Chapters iPart={iPart} arrChapter={arrChapter}/>
                </Col>}
            </Col>

        }))
        }
    </Col>
}

export default memo(Parts);