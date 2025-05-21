import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../../Auxiliary/ButtonEx.tsx";
import clsx from "clsx";
import {useStoreFolding} from "../Stores/storeAux.ts";
import {IReplica} from "../types.ts";


export const Text = ({children = null, className = ''}) => <div className={clsx(
    "select-none text-black/60 content-center", className)
}>{children}</div>;

interface IComponentCol extends React.HTMLAttributes<HTMLDivElement> {
    noBorder?: boolean;
}

export const Col = ({children, className = '', noBorder = false, role = '', ...rest}: IComponentCol) => <div
    role={role}
    className={clsx(
        className,
        "flex flex-col ",
        noBorder ? "" : "border border-black/20 rounded p-1",
        "gap-1"
    )} {...rest}>{children}</div>;

export const Row = ({children, className = '', role = ''}) => <div role={role}
                                                                   className={clsx(className, "flex flex-row gap-1")}>{children}</div>;

export const SwitchHide = ({id}) => <ButtonEx
    // className={clsx(useStoreFolding.getState().isHide(id) ? 'bi-plus-square' : 'bi-square')}
    className={clsx(useStoreFolding.getState().isHide(id) ? 'bi-caret-right-square' : 'bi-caret-down-square')}
    onClick={() => useStoreFolding.getState().switchVisibility(id)}/>

export const ButtonDelete = ({onDelete}) => <ButtonEx
    className={clsx("bi-x-lg flex-grow-0 hover:bg-red-700")}
    description="Удалить"
    onConfirm={onDelete}/>

export const TextInput = ({value, placeholder, onChange}) => <input type="text" value={value} placeholder={placeholder}
                                                                    className={clsx("px-2 w-full",
                                                                        // "border border-black/20 rounded-sm"
                                                                    )}
                                                                    onChange={onChange}/>

