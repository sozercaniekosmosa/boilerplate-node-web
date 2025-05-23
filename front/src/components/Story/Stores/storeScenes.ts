import {IPart, IScene, ISceneGen, IStoreBook, IStoreFolding, IStoreScenesGen} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {generateUID} from "../../../lib/utils.ts";
import {arrMapOfScene, getObjectMap} from "../maps.ts";


export const useStoreScenesGen = create<IStoreScenesGen>()(
    persist(immer(set => ({
        arrSceneGen: [],
        mapID: {},

        addSceneGen: (scene: ISceneGen) => set((state) => {
            const _scene = scene ?? (getObjectMap(arrMapOfScene) as ISceneGen);
            state.arrSceneGen.push(_scene);
            state.mapID[_scene.id] = state.arrSceneGen.length - 1;
        }),
        deleteSceneGen: (iScene: number) => set((state) => {
            const {id} = state.arrSceneGen[iScene];
            state.arrSceneGen.splice(iScene, 1);
            delete state.mapID[id];
        }),
        updateSceneGen: (iScene: number, scene: ISceneGen) => set((state) => {
            Object.assign(state.arrSceneGen[iScene], scene)
        }),
        removeAllScenesGen: () => set(state => {
            state.arrSceneGen = [];
            state.mapID = {};
        }),
        getData: async () => set((state) => ({arrSceneGen: state.arrSceneGen})),
    })), {name: 'scenesGen', version: 0})
)