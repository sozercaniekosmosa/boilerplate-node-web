import React from "react";

// const NestedList: React.FC<any> = ({obj, parent = null, index, onInsert = null}) => {
const NestedList = ({obj, parent = null, index = null, onInsert = null}) => {
    const {arr, data} = obj
    return (
        <div className="d-flex flex-column ms-2">
            {onInsert && onInsert(parent, obj, index)}
            <div className="flex-column border rounded">
                {arr.length > 0 && arr.map((it, index) => <NestedList key={index} obj={it} parent={obj} index={index} onInsert={onInsert}/>)}
            </div>
        </div>);
};

export default NestedList;