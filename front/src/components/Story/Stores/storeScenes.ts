import {IPart, IScene, ISceneGen, IStoreBook, IStoreFolding, IStoreScenesGen} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {generateUID} from "../../../lib/utils.ts";
import {arrMapOfScene, getObjectMap} from "../maps.ts";


export const useStoreScenesGen = create<IStoreScenesGen>()(
    persist(immer(set => ({
        arrSceneGen: [],
        addSceneGen: (scene: ISceneGen) => set((state) => {
            state.arrSceneGen.push(scene ?? (getObjectMap(arrMapOfScene) as ISceneGen));
        }),
        deleteSceneGen: (iScene: number) => set((state) => {
            state.arrSceneGen.splice(iScene, 1);
        }),
        updateSceneGen: (iScene: number, scene: ISceneGen) => set((state) => {
            Object.assign(state.arrSceneGen[iScene], scene)
        }),
        removeAllScenesGen: () => set({arrSceneGen: []}),
        getData: async () => set((state) => ({arrSceneGen: state.arrSceneGen})),
    })), {name: 'scenesGen', version: 0})
)