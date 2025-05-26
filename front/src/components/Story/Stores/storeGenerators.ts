import {ICharacterGen, IMap, IMapProp, IGenScene, IStoreCharacterGen, IStoreGenScene} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {arrMapOfCharacter, arrMapOfScene, getObjectMap} from "../maps.ts";
import {generateUID} from "../../../lib/utils.ts";


export const useStoreCharacterGen = create<IStoreCharacterGen>()(
    persist(immer(set => ({
        arrCharacterGen: [],
        listID: {},

        addCharacterGen: (character: ICharacterGen) => set((state) => {
            const _character = character ?? (getObjectMap(arrMapOfCharacter) as ICharacterGen);
            state.arrCharacterGen.push(_character);
            state.listID[_character.id] = state.arrCharacterGen.length - 1;
        }),
        deleteCharacterGen: (iCharacter: number) => set((state) => {
            const {id} = state.arrCharacterGen[iCharacter];
            state.arrCharacterGen.splice(iCharacter, 1);
            delete state.listID[id];

            for (let i = 0; i < state.arrCharacterGen.length; i++)
                state.listID[state.arrCharacterGen[i].id] = i; //обновим id
        }),
        updateCharacterGen: (iCharacter: number, character: ICharacterGen) => set((state) => {
            Object.assign(state.arrCharacterGen[iCharacter], character)
        }),
        removeAllCharactersGen: () => set(state => {
            state.arrCharacterGen = [];
            state.listID = {};
        }),
        getData: async () => set((state) => ({arrCharacterGen: state.arrCharacterGen})),
    })), {name: 'charactersGen', version: 0})
)


export const useStoreGenScene = create<IStoreGenScene>()(
    persist(immer(set => ({
        arrGenScene: [],
        listID: {},

        addGenScene: (scene: IMap) => set((state) => {
            //делаем копию карты свойств описания сцены
            const arrMapProp: IMapProp[] = (arrMapOfScene.map((scene) => ({...scene, text: ''} as IMapProp)));
            let id = generateUID();
            state.arrGenScene.push(scene ?? {id, name: '', arrMapProp});
            state.listID[id] = state.arrGenScene.length - 1;
        }),
        deleteGenScene: (iScene: number) => set((state) => {
            const {id} = state.arrGenScene[iScene];
            state.arrGenScene.splice(iScene, 1);
            delete state.listID[id];

            for (let i = 0; i < state.arrGenScene.length; i++)
                state.listID[state.arrGenScene[i].id] = i; //обновим id
        }),
        updateGenSceneName: (iScene: number, name: string) => set((state) => {
            state.arrGenScene[iScene].name = name;
        }),
        updateGenSceneProp: (iScene: number, iProp: number, key: string, val: any) => set((state) => {
            state.arrGenScene[iScene].arrMapProp[iProp][key] = val;
        }),
        addGenSceneProp: (iScene: number, prop: IMapProp) => set((state) => {
            state.arrGenScene[iScene].arrMapProp.push(prop ?? {desc: '', name: '', text: '', title: '', type: ''} as IMapProp);
        }),

        removeAllGenScene: () => set(state => {
            state.arrGenScene = [];
            state.listID = {};
        }),
        getData: async () => set((state) => ({arrGenScene: state.arrGenScene})),
    })), {name: 'genScene', version: 0})
)