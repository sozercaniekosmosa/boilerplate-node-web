import {IPart, IScene, ISceneGen, IStoreBook, IStoreFolding, IStoreScenesGen} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {generateUID} from "../../../lib/utils.ts";

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
const createPartCRUD = (key: string, name: string, clbDef: () => any, set: any) => ({
    [`add${name}`]: (v?: any) => set((s: any) => {
        s[key].push(v ?? clbDef())
    }),
    [`update${name}`]: (iPart: number, val: any) => set((s: any) => {
        iPart in s[key] && Object.assign(s[key][iPart], val)
    }),
    [`delete${name}`]: (iPart: number) => set((s: any) => {
        s[key].splice(iPart, 1)
    })
})

const createChapterCRUD = (parent: string, child: string, name: string, clbDef: () => any, set: any) => ({
    [`add${name}`]: (iPart: number, v?: any) => set((s: any) => {
        s[parent][iPart]?.[child].push(v ?? clbDef())
    }),
    [`update${name}`]: (iPart: number, iChapter: number, v: any) => set((s: any) => {
        iChapter in s[parent][iPart]?.[child] && Object.assign(s[parent][iPart][child][iChapter], v)
    }),
    [`delete${name}`]: (iPart: number, iChapter: number) => set((s: any) => {
        s[parent][iPart]?.[child].splice(iChapter, 1)
    })
})

const createSceneCRUD = (gParent: string, parent: string, child: string, name: string, clbDef: () => any, set: any) => ({
    [`add${name}`]: (iPart: number, iChapter: number, v?: any) => set((s: any) => {
        s[gParent][iPart]?.[parent][iChapter]?.[child].push(v ?? clbDef())
    }),
    [`update${name}`]: (iPart: number, iChapter: number, iScene: number, v: any) => set((s: any) => {
        iScene in s[gParent][iPart]?.[parent][iChapter]?.[child] && Object.assign(s[gParent][iPart][parent][iChapter][child][iScene], v)
    }),
    [`delete${name}`]: (iPart: number, iChapter: number, iScene: number) => set((s: any) => {
        s[gParent][iPart]?.[parent][iChapter]?.[child].splice(iScene, 1)
    })
})

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

        ...createPartCRUD('arrPart', 'Part', () => ({id: generateUID(), name: '', arrChapter: []}), set),
        ...createChapterCRUD('arrPart', 'arrChapter', 'Chapter', () => ({id: generateUID(), name: '', arrScene: []}), set),
        ...createSceneCRUD('arrPart', 'arrChapter', 'arrScene', 'Scene',
            () => ({id: generateUID(), sceneSelected: '', name: '', text: '', arrCharacter: [], arrItem: [], arrEvent: []}), set),
        ...createSceneItemCRUD('arrCharacter', 'Character', () => ({id: generateUID(), name: ''}), set),
        ...createSceneItemCRUD('arrItem', 'Item', () => ({id: generateUID(), name: ''}), set),
        ...createSceneItemCRUD('arrEvent', 'Event', () => null, set),

        getData: async () => set((state) => ({arrPart: state.arrPart})),
    })), {name: 'book', version: 0})
)