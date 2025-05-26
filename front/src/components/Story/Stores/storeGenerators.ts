import {ICharacterGen, IMap, IMapItem, ISceneGen, IStoreCharacterGen, IStoreScenesGen} from "../types.ts";
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


export const useStoreScenesGen = create<IStoreScenesGen>()(
    persist(immer(set => ({
        arrSceneGen: [],
        listID: {},

        addSceneGen: (scene: IMap) => set((state) => {
            //делаем копию карты свойств описания сцены
            const arrMap: IMapItem[] = (arrMapOfScene.map((scene) => ({...scene, text: ''} as IMapItem)));
            let id = generateUID();
            state.arrSceneGen.push(scene ?? {id, name: '', arrMap});
            state.listID[id] = state.arrSceneGen.length - 1;
        }),
        deleteSceneGen: (iScene: number) => set((state) => {
            const {id} = state.arrSceneGen[iScene];
            state.arrSceneGen.splice(iScene, 1);
            delete state.listID[id];

            for (let i = 0; i < state.arrSceneGen.length; i++)
                state.listID[state.arrSceneGen[i].id] = i; //обновим id
        }),
        updateSceneGen: (iScene: number, scene: IMap) => set((state) => {
            state.arrSceneGen[iScene] = scene;
        }),
        removeAllScenesGen: () => set(state => {
            state.arrSceneGen = [];
            state.listID = {};
        }),
        getData: async () => set((state) => ({arrSceneGen: state.arrSceneGen})),
    })), {name: 'scenesGen', version: 0})
)