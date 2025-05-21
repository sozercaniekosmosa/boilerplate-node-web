import {IPart, IScene, ISceneGen, IStoreBook, IStoreFolding, IStoreScenesGen} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {generateUID} from "../../../lib/utils.ts";

export const useStoreFolding = create<IStoreFolding>()(
    persist((set, get) => ({
        listFolding: {},
        isHide: id => get().listFolding[id],
        switchVisibility: id => set(state => ({
            listFolding: {...state.listFolding, [id]: !state.listFolding[id]}
        }))
    }), {name: 'folding', version: 0}))

