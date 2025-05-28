import {IChapter, IPart, IScene, IStoreBook} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {generateUID as getUID} from "../../../lib/utils.ts";

const arrPart: IPart[] = [
    /*    {
            id: '13851',
            name: 'Вступление',
            arrChapter: [
                {
                    id: '131',
                    name: 'Как все началось',
                    arrScene: [
                        {
                            id: '132',
                            name: 'Ранний визит',
                            scene: 'Детективное агенство',
                            arrCharacter: [
                                {name: 'Детектив'},
                                {name: 'Сьюзи'}
                            ],
                            arrItem: [
                                {name: 'Документы'}
                            ],
                            arrEvent: [
                                {
                                    type: 'реплика',
                                    object: 'Детектив',
                                    manner: 'спокойно',
                                    action: 'Здравствуйте, чем могу помочь?'
                                },
                                {
                                    type: 'реплика',
                                    object: 'Сьюзи',
                                    manner: 'слезы',
                                    action: 'Здравствуйте, помогите мне найти отца?',
                                },
                                {
                                    type: 'реплика',
                                    object: 'Детектив',
                                    manner: 'успокаивающе',
                                    action: 'Расскажите, что случилось?'
                                },
                                {
                                    type: 'реплика',
                                    object: 'Сьюзи',
                                    manner: 'слезы',
                                    action: 'Это все из-за этих документов'
                                },
                                {type: 'свойство', object: 'Детектив', propKey: 'документы', propVal: 'документы'},
                                {
                                    type: 'реплика',
                                    object: 'Детектив',
                                    manner: 'с недоумением',
                                    action: 'Тут записи и карты Перу. Как это может быть причиной, раскажите подробнее?'
                                },
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: '1381',
            name: 'Основная часть',
            arrChapter: []
        }*/
]


// Helper functions
const createSceneItemCRUD = (key: string, name: string, clbDef: () => any, set: any) => ({
    [`add${name}`]: (iPart: number, iChapter: number, iScene: number, v?: any) => set((s: any) => {
        s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.[key].push(v ?? clbDef())
    }),
    [`update${name}`]: (iPart: number, iChapter: number, iScene: number, i: number, v: any) => set((s: any) => {
        i in s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.[key] && Object.assign(s.arrPart[iPart].arrChapter[iChapter].arrScene[iScene][key][i], v)
    }),
    [`delete${name}`]: (iPart: number, iChapter: number, iScene: number, i: number) => set((s: any) => {
        s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.[key].splice(i, 1)
    })
})

export const useStoreBook = create<IStoreBook>()(
    persist(immer(set => ({
        name: '',
        arrPart: [],
        currScenePath: {
            iPart: 0, iChapter: 0, iScene: 0, iEvent: 0
        },

        setName: name => set(state => {
            state.name = name;
        }),

        setCurrentScenePath: ({iPart, iChapter, iScene, iEvent}) => set(state => {
            iPart != undefined && (state.currScenePath.iPart = iPart);
            iChapter != undefined && (state.currScenePath.iChapter = iChapter);
            iScene != undefined && (state.currScenePath.iScene = iScene);
            iEvent != undefined && (state.currScenePath.iEvent = iEvent);
        }),

        addPart: (part?: IPart) => set((state: any) => {
            state.arrPart.push(part ?? {id: getUID(), name: '', arrChapter: []})
        }),
        updatePart: (iPart: number, val: any) => set((state: any) => {
            iPart in state.arrPart && Object.assign(state.arrPart[iPart], val)
        }),
        deletePart: (iPart: number) => set((state: any) => {
            state.arrPart.splice(iPart, 1)
        }),

        addChapter: (iPart: number, chapter?: IChapter) => set((state: any) => {
            state.arrPart[iPart]?.arrChapter.push(chapter ?? {id: getUID(), name: '', arrScene: []})
        }),
        updateChapter: (iPart: number, iChapter: number, v: any) => set((state: any) => {
            iChapter in state.arrPart[iPart]?.arrChapter && Object.assign(state.arrPart[iPart].arrChapter[iChapter], v)
        }),
        deleteChapter: (iPart: number, iChapter: number) => set((state: any) => {
            state.arrPart[iPart]?.arrChapter.splice(iChapter, 1)
        }),

        addScene: (iPart: number, iChapter: number, scene?: IScene) => set((s: any) => {
            var def = {
                id: getUID(),
                sceneSelected: '',
                name: '',
                text: '',
                aim: '',
                arrCharacter: [],
                arrItem: [],
                arrEvent: []
            };
            s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene.push(scene ?? def)
        }),
        updateScene: (iPart: number, iChapter: number, iScene: number, v: any) => set((s: any) => {
            iScene in s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene && Object.assign(s.arrPart[iPart].arrChapter[iChapter].arrScene[iScene], v)
        }),
        deleteScene: (iPart: number, iChapter: number, iScene: number) => set((s: any) => {
            s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene.splice(iScene, 1)
        }),

        ...createSceneItemCRUD('arrCharacter', 'Character', () => ({id: getUID(), name: ''}), set),
        ...createSceneItemCRUD('arrItem', 'Item', () => ({id: getUID(), name: ''}), set),
        ...createSceneItemCRUD('arrEvent', 'Event', () => null, set),

        getData: async () => set((state) => ({arrPart: state.arrPart})),
    })), {name: 'book', version: 0})
)