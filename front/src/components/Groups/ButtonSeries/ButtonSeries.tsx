// import ButtonEx from "../ButtonEx/ButtonEx";
import React from "react";

import {GeneratorList} from "../GeneratorList.tsx";
import ButtonEx from "../../Auxiliary/ButtonEx.tsx";
import Group from "../../Auxiliary/Group.tsx";


export type TArrParam = Array<any> | Array<[any]>;
export type TOnAction = (...arrParam: any[]) => any;

interface TPropsElement {
    arrParam: TArrParam;
    onAction?: TOnAction;
    className?: string;
    style?: {};
}

function ButtonSeries({arrParam, onAction, className = '', style = {}}: TPropsElement) {
    return <Group className={className} style={style}>
        <GeneratorList arrParam={arrParam} onGenerate={(...arrPar) =>
            <ButtonEx key={arrPar?.[arrPar.length - 1] ?? 0} onAction={() => onAction(...arrPar)}>
                {arrPar[0]}
            </ButtonEx>}/>
    </Group>
}

export {ButtonSeries};

