import React from "react";

// const NestedList: React.FC<any> = ({obj, parent = null, index, onInsert = null}) => {
const NestedList = ({obj, parent = null, index = null, onInsert = null}) => {
    const {arr, data} = obj;
    return onInsert && onInsert(parent, obj, index, arr.length > 0 && arr.map((it, index) =>
        <NestedList key={index} obj={it} parent={obj} index={index} onInsert={onInsert}/>));
};

export default NestedList;