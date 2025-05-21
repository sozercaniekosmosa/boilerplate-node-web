import React from 'react';
import PropTypes from 'prop-types';
import TextWrite from "../../Auxiliary/TextWrite.tsx";
import {Col} from "./Auxiliary.tsx";
import {useStoreBook} from "../Stores/storeBook.ts";
import {IPath} from "../types.ts";


interface IDetails extends React.HTMLAttributes<HTMLDivElement> {
}

const Details: React.FC<IDetails> = (rest) => {

    const arrPart = useStoreBook(state => state.arrPart);
    const {iPart, iChapter, iScene, iEvent}: IPath = useStoreBook(state => state.currScenePath);
    const updateScene = useStoreBook(state => state.updateScene);
    const scene = arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene];

    return <Col noBorder={true} {...rest}>
        <div>{scene?.name ?? 'Название сцены'}</div>
        <TextWrite value={scene?.text} className="h-full" placeholder="Введите текст описывающий сцену"
                   onChange={(e: any) => {
                       updateScene(iPart, iChapter, iScene, {text: e.target.value});
                   }}/>
    </Col>;
};

export default Details;