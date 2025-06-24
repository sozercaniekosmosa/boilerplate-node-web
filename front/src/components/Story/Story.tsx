import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Tab, Tabs} from "../Auxiliary/Tabs.tsx";
import Parts from "./components/Parts.tsx";
import Details from "./components/Details.tsx";
import GenScene from "./Generator.tsx";

import {useStoreGenCharacter, useStoreGenItem, useStoreGenScene} from "./Stores/storeGenerators.ts";

const Story: React.FC<any> = () => {

    return <Tabs defaultActiveKey="plan" className="h-full text-sm">
        <Tab eventKey="plan" title="План" className="flex flex-row">
            <Parts className="overflow-x-hidden overflow-y-auto grow p-1 w-[50%]"/>
            <Details className="p-1 w-[50%]"/>
            {/*<Details className="overflow-x-hidden overflow-y-auto grow p-1 w-[50%]"/>*/}
        </Tab>
        <Tab eventKey="gen-scene" title="Сцены" style={{flex: 1}} className="">
            <GenScene storeGen={useStoreGenScene} title="Название сцены" titleAddNew="Добавить новую сцену"
                      className="overflow-x-hidden overflow-y-auto grow p-1"/>
        </Tab>
        <Tab eventKey="gen-character" title="Персонажи" style={{flex: 1}} className="">
            <GenScene storeGen={useStoreGenCharacter} title="Имя персонажа" titleAddNew="Добавить нового персонажа"
                      className="overflow-x-hidden overflow-y-auto grow p-1"/>
        </Tab>
        <Tab eventKey="gen-item" title=" Предметы" style={{flex: 1}} className="">
            <GenScene storeGen={useStoreGenItem} title="Название предмета" titleAddNew="Добавить новоый предмет"
                      className="overflow-x-hidden overflow-y-auto grow p-1"/>
        </Tab>
    </Tabs>
};

export default Story;