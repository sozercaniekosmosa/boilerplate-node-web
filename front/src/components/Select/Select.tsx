import React from 'react';

const Select = ({onChange = null, arrList, value = null, style = {}, className = ''}) => {
    let arr: Array<[any, string]> | [string];
    arr = Array.isArray(arrList) ? arrList.map(it => [it, it]) : arrList && Object.entries(arrList);

    const initValue = (typeof value == 'string') ? value : (typeof value == 'number') ? arr[value][0] : arr[0][0];


    return (<select style={style} value={initValue} className={"form-select " + className}
                    onChange={(e) => onChange && onChange(e.target.value)}>{arr.map(([text, val], idi) => {
        return <option value={val as string} key={idi}>{text as string}</option>
    })}</select>);
}

export default Select;