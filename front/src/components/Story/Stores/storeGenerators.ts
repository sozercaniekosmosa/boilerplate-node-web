import {IMap, IMapProp, IStoreGen} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {arrMapOfCharacter, arrMapOfItem, arrMapOfScene} from "../maps.ts";
import {generateUID as getUID} from "../../../lib/utils.ts";
import {formatDateTime} from "../../../lib/time.ts";

const createStoreGen = (arrMap: IMapProp[], nameStore: string) => create<IStoreGen>()(
    persist(immer((set, get) => ({
        arrGen: [],
        listID: {},

        addGen: (item: IMap) => {
            set((state) => {
                //делаем копию карты свойств описания сцены
                const arrMapProp: IMapProp[] = (arrMap.map((item, i) => {
                    const id = getUID();
                    // state.listPropID[id] = [state.arrGen.length, i];
                    return {...item, id, value: ''} as IMapProp;
                }));
                let id = getUID();
                state.arrGen.push(item ?? {id, name: formatDateTime(), arrMapProp});
            });

            get().updateListID()
        },
        deleteGen: (i: number) => {
            set((s) => {
                const {id} = s.arrGen[i];
                s.arrGen.splice(i, 1);
                delete s.listID[id];
            });
            get().updateListID();
        },
        updateGenName: (i: number, name: string) => set((s) => {
            s.arrGen[i].name = name;
        }),
        updateGenProp: (i: number, iProp: number, prop: any) => set((s) => {
            s.arrGen[i].arrMapProp[iProp] = {...s.arrGen[i].arrMapProp[iProp], ...prop};
        }),
        addGenProp: (i: number, prop: IMapProp) => {
            set((s) => {
                let def = {
                    id: getUID(), desc: '', name: '', value: '', title: '', ext: false, list: null, section: false
                } as IMapProp;
                s.arrGen[i].arrMapProp.push({...def, ...prop});
            });
            get().updateListID();
        },

        deleteGenProp: (i: number, iProp: number) => {
            set((s) => {
                const {id} = s.arrGen[i].arrMapProp[iProp];
                s.arrGen[i].arrMapProp.splice(iProp, 1);
            });
            get().updateListID();
        },

        removeAllGen: () => {
            set(s => {
                s.arrGen = [];
                s.listID = {};
            });
            get().updateListID();
        },

        updateListID: () => {
            set((s) => {
                const listID = {};
                s.arrGen.forEach(({id, arrMapProp}, i) => {
                    listID[id] = i;
                    arrMapProp.forEach(({id}, j) => listID[id] = [i, j])
                })
                s.listID = listID;
            });
        },

        getData: async () => set((state) => ({arrGen: state.arrGen})),

    })), {name: nameStore, version: 0})
);

export const useStoreGenScene = createStoreGen(arrMapOfScene, 'genScene');
export const useStoreGenCharacter = createStoreGen(arrMapOfCharacter, 'genCharacter');
export const useStoreGenItem = createStoreGen(arrMapOfItem, 'genItem');