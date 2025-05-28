import {IMap, IMapProp, IStoreGen} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {arrMapOfCharacter, arrMapOfItem, arrMapOfScene} from "../maps.ts";
import {generateUID} from "../../../lib/utils.ts";

const createStoreGen = (arrMap: IMapProp[], nameStore: string) => create<IStoreGen>()(
    persist(immer(set => ({
        arrGen: [],
        listID: {},

        addGen: (item: IMap) => set((state) => {
            //делаем копию карты свойств описания сцены
            const arrMapProp: IMapProp[] = (arrMap.map((item) => ({...item, text: ''} as IMapProp)));
            let id = generateUID();
            state.arrGen.push(item ?? {id, name: '', arrMapProp});
            state.listID[id] = state.arrGen.length - 1;
        }),
        deleteGen: (i: number) => set((state) => {
            const {id} = state.arrGen[i];
            state.arrGen.splice(i, 1);
            delete state.listID[id];

            for (let i = 0; i < state.arrGen.length; i++)
                state.listID[state.arrGen[i].id] = i; //обновим id
        }),
        updateGenName: (i: number, name: string) => set((state) => {
            state.arrGen[i].name = name;
        }),
        updateGenProp: (i: number, iProp: number, prop: any) => set((state) => {
            state.arrGen[i].arrMapProp[iProp] = {...state.arrGen[i].arrMapProp[iProp], ...prop};
        }),
        addGenProp: (i: number, prop: IMapProp) => set((state) => {
            state.arrGen[i].arrMapProp.push(prop ?? {
                desc: '',
                name: '',
                text: '',
                title: '',
                type: ''
            } as IMapProp);
        }),

        deleteGenProp: (i: number, iProp: number) => set((state) => {
            state.arrGen[i].arrMapProp.splice(iProp, 1);
        }),

        removeAllGen: () => set(state => {
            state.arrGen = [];
            state.listID = {};
        }),
        getData: async () => set((state) => ({arrGen: state.arrGen})),
    })), {name: nameStore, version: 0})
);

export const useStoreGenScene = createStoreGen(arrMapOfScene, 'genScene');
export const useStoreGenCharacter = createStoreGen(arrMapOfCharacter, 'genCharacter');
export const useStoreGenItem = createStoreGen(arrMapOfItem, 'genItem');