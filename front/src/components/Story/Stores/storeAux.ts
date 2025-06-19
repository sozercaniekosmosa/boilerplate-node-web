import {IStoreData, IStoreState} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";

export const useStoreState = create<IStoreState>()(
    persist((set, get) => ({
        listState: {},
        isState: id => get().listState?.[id] == undefined ? true : get().listState?.[id],
        switchState: id => set(state => ({
            listState: {...state.listState, [id]: state.listState?.[id] == undefined ? false : !state.listState?.[id]}
        })),
        setState: (id, val) => set(state => ({
            listState: {...state.listState, [id]: val}
        })),
    }), {name: 'states', version: 0}))

export const useStoreData = create<IStoreData>()(
    persist((set, get) => ({
        data: {},
        setData: (id, val) => set(state => ({
            data: {...state.data, [id]: val}
        }))
    }), {name: 'data', version: 0}))


