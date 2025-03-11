// import ButtonEx from "../ButtonEx/ButtonEx";
import React from "react";

import {ButtonGroup} from "react-bootstrap";
import {GeneratorList} from "../GeneratorList.tsx";
import ButtonEx from "../../ButtonEx/ButtonEx.tsx";


export type TArrParam = Array<any> | Array<[any]>;
export type TOnAction = (...arrParam: any[]) => any;

interface TPropsElement {
    arrParam: TArrParam;
    onAction?: TOnAction;
    className?: string;
    style?: {};
}

function ButtonSeries({arrParam, onAction, className = '', style = {}}: TPropsElement) {
    return <ButtonGroup className={className} style={style}>
        <GeneratorList arrParam={arrParam} onGenerate={(...arrPar) =>
            <ButtonEx variant="secondary btn-sm text-truncate" key={arrPar?.[arrPar.length - 1] ?? 0} onAction={() => onAction(...arrPar)}>
                {arrPar[0]}
            </ButtonEx>}/>
    </ButtonGroup>
}

export {ButtonSeries};

