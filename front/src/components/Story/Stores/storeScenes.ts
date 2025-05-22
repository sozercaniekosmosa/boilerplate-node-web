import {IPart, IScene, ISceneGen, IStoreBook, IStoreFolding, IStoreScenesGen} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {generateUID} from "../../../lib/utils.ts";
import {arrMapOfScene, getObjectMap} from "../maps.ts";


export const useStoreScenesGen = create<IStoreScenesGen>()(
    persist(immer(set => ({
        arrScenes: [],
        addScene: (scene: ISceneGen) => set((state) => {
            state.arrScenes.push(scene ?? (getObjectMap(arrMapOfScene) as ISceneGen));
        }),
        deleteScene: (iScene: number) => set((state) => {
            state.arrScenes.splice(iScene, 1);
        }),
        updateScene: (iScene: number, scene: ISceneGen) => set((state) => {
            Object.assign(state.arrScenes[iScene], scene)
        }),
        removeAllScenes: () => set({arrScenes: []}),
        getData: async () => set((state) => ({arrScenes: state.arrScenes})),
    })), {name: 'scenesGen', version: 0})
)