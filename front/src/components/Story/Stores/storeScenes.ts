import {IPart, IScene, ISceneGen, IStoreBook, IStoreFolding, IStoreScenesGen} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {generateUID} from "../../../lib/utils.ts";


export const useStoreScenesGen = create<IStoreScenesGen>((set) => ({
        arrScenes: [],
        add: (scene: ISceneGen) => set((state) => ({arrScenes: [...state.arrScenes, scene]})),
        remove: (sceneName: string) => set((state) => ({arrScenes: [...state.arrScenes.filter(({name}) => name != sceneName)]})),
        update: (scene: ISceneGen, sceneName: string) => set((state) => ({arrScenes: [...state.arrScenes.map((it) => it.name != sceneName ? scene : it)]})),
        removeAll: () => set({arrScenes: []}),
        fetch: async () => set({arrScenes: []})
    })
)