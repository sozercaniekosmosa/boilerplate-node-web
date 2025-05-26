import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Tab, Tabs} from "../Auxiliary/Tabs.tsx";
import Parts from "./components/Parts.tsx";
import Details from "./components/Details.tsx";
import GenScene from "./GenScene.tsx";
import CharacterGen from "./CharacterGen.tsx";

const Story: React.FC<any> = () => {

    return <Tabs defaultActiveKey="plan" className="h-full">
        <Tab eventKey="plan" title="План" className="flex flex-row">
            <Parts className="overflow-auto grow p-1 w-[50%]"/>
            <Details className="p-1 w-[50%]"/>
        </Tab>
        <Tab eventKey="gen-scene" title=" Сцены" style={{flex: 1}} className="">
            <GenScene className="overflow-auto grow p-1"/>
        </Tab>
        <Tab eventKey="gen-character" title=" Персонажи" style={{flex: 1}} className="">
            <CharacterGen className="overflow-auto grow p-1"/>
        </Tab>
        <Tab eventKey="gen-item" title=" Предметы" style={{flex: 1}} className="">
            {/*<GenCharacter book={book} setBook={setBook}/>*/}
        </Tab>
    </Tabs>
};

export default Story;