import {IStoreFolding} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";

export const useStoreFolding = create<IStoreFolding>()(
    persist((set, get) => ({
        listFolding: {},
        isHide: id => get().listFolding[id],
        switchVisibility: id => set(state => ({
            listFolding: {...state.listFolding, [id]: !state.listFolding[id]}
        }))
    }), {name: 'folding', version: 0}))

