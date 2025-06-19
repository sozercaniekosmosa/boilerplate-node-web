import {IChangeProperties, IChapter, IEvent, IPart, IPath, IScene, IStoreBook} from "../types.ts";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {debounce, generateUID as getUID} from "../../../lib/utils.ts";

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

// function debounce(func, delay) {
//     let timeout;
//     return function () {
//         const context = this;
//         const args = arguments;
//         clearTimeout(timeout);
//         timeout = setTimeout(() => func.apply(context, args), delay);
//     };
// }

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
    persist(immer((set, get) => ({
            name: '',
            arrPart: [],
            listID: {},
            listChangeProp: {},
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

            addPart: (part?: IPart) => {
                set((s: IStoreBook) => {
                    s.arrPart.push(part ?? {id: getUID(), name: '', arrChapter: []})
                })
                get().updateListIDDebounce();
            },
            updatePart: (iPart, val) => {
                set((s: IStoreBook) => {
                    s.arrPart?.[iPart] && Object.assign(s.arrPart[iPart], val);
                })
                // get().updateListID();
            },
            deletePart: (iPart) => {
                set((s: IStoreBook) => {
                    s.arrPart.splice(iPart, 1);
                })
                get().updateListID();
            },

            addChapter: (iPart, chapter?: IChapter) => {
                set((s: IStoreBook) => {
                    s.arrPart[iPart]?.arrChapter.push(chapter ?? {id: getUID(), name: '', arrScene: []})
                })
                get().updateListIDDebounce();
            },
            updateChapter: (iPart, iChapter, v) => {
                set((s: IStoreBook) => {
                    s.arrPart[iPart]?.arrChapter?.[iChapter] && Object.assign(s.arrPart[iPart].arrChapter[iChapter], v)
                })
                // get().updateListID();
            },
            deleteChapter: (iPart, iChapter) => {
                set((s: IStoreBook) => {
                    s.arrPart[iPart]?.arrChapter.splice(iChapter, 1);
                })
                get().updateListID();
            },

            addScene: (iPart, iChapter, scene?: IScene) => {
                set((s: IStoreBook) => {
                    var def = {aim: '', arrCharacterID: [], arrEvent: [], arrItemID: [], id: getUID(), sceneID: '', text: ''};
                    s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene.push(scene ?? def)
                })
                get().updateListIDDebounce();
            },
            updateScene: (iPart, iChapter, iScene, v) => {
                set((s: IStoreBook) => {
                    s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene?.[iScene] &&
                    Object.assign(s.arrPart[iPart].arrChapter[iChapter].arrScene[iScene], v)
                })
                // get().updateListID();
            },
            deleteScene: (iPart, iChapter, iScene) => {
                set((s: IStoreBook) => {
                    s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene.splice(iScene, 1);
                })
                get().updateListID();
            },

            // ...createSceneItemCRUD('arrCharacterID', 'CharacterID', () => (getUID()), set),
            addCharacterID: (iPart: number, iChapter: number, iScene: number, v?: any) => {
                set((s: any) => {
                    var def = getUID();
                    s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrCharacterID.push(v ?? def);
                })
                get().updateListIDDebounce();
            },
            updateCharacterID: (iPart: number, iChapter: number, iScene: number, i: number, v: any) => {
                set((s: any) => {
                    i in s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrCharacterID && Object.assign(s.arrPart[iPart].arrChapter[iChapter].arrScene[iScene].arrCharacterID[i], v);
                })
                // get().updateListID();
            },
            deleteCharacterID: (iPart: number, iChapter: number, iScene: number, i: number) => {
                set((s: any) => {
                    s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrCharacterID.splice(i, 1);
                })
                get().updateListID();
            },

            // ...createSceneItemCRUD('arrItemID', 'ItemID', () => (getUID()), set),
            addItemID: (iPart: number, iChapter: number, iScene: number, v?: any) => {
                set((s: any) => {
                    var def = getUID();
                    s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrItemID.push(v ?? def);
                })
                get().updateListIDDebounce();
            },
            updateItemID: (iPart: number, iChapter: number, iScene: number, i: number, v: any) => {
                set((s: any) => {
                    i in s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrItemID && Object.assign(s.arrPart[iPart].arrChapter[iChapter].arrScene[iScene].arrItemID[i], v);
                })
                // get().updateListID();
            },
            deleteItemID: (iPart: number, iChapter: number, iScene: number, i: number) => {
                set((s: any) => {
                    s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrItemID.splice(i, 1);
                })
                get().updateListID();
            },

            addEvent: (iPart: number, iChapter: number, iScene: number, v?: any) => {
                set((s: any) => {
                    const def = {arrChangeProp: [], desc: '', id: getUID(), manner: '', objectID: '', subjectID: '', type: '', ...v};
                    s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrEvent.push(def);
                })
                get().updateListIDDebounce();
            },
            updateEvent: (iPart: number, iChapter: number, iScene: number, i: number, v: any) => {
                set((s: any) => {
                    i in s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrEvent && Object.assign(s.arrPart[iPart].arrChapter[iChapter].arrScene[iScene].arrEvent[i], v);
                })
                // get().updateListID();
            },
            deleteEvent: (iPart: number, iChapter: number, iScene: number, i: number) => {
                set((s: any) => {
                    s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrEvent.splice(i, 1);
                })
                get().updateListID();
            },

            addChangeProp: (iPart, iChapter, iScene, iEvent, prop?: IChangeProperties) => {
                set((s: IStoreBook) => {
                    let arrChangeProp = s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrEvent[iEvent]?.arrChangeProp;
                    let iProp = arrChangeProp.length;
                    const order = iPart * 1e12 + iChapter * 1e9 + iScene * 1e6 + iEvent * 1e3 + iProp;
                    const def: IChangeProperties = {id: getUID(), order, targetID: '', propID: '', value: '', type: null, ...prop};
                    arrChangeProp.push(def);
                    console.log('arrChangeProp', JSON.parse(JSON.stringify(arrChangeProp)))
                })
                get().updateListIDDebounce();
            },
            updateChangeProp: (iPart, iChapter, iScene, iEvent, iProp, prop) => {
                set((s: IStoreBook) => {

                    const arrChangeProp = s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrEvent[iEvent]?.arrChangeProp

                    if (prop?.targetID) {
                        const {id, order, propID, targetID, type, value} = arrChangeProp?.[iProp];

                        if (!targetID && !(prop.targetID in s.listChangeProp)) {
                            s.listChangeProp[prop.targetID] = [];
                        }
                        // Если на старое место претендует новое свойство
                        if (targetID && prop.targetID != targetID) {
                            if (!(prop.targetID in s.listChangeProp)) { // И новый target отсутствует в списке
                                s.listChangeProp[prop.targetID] = []; // Делаем новые
                            }
                            if (targetID in s.listChangeProp) { // И если страрый target присутствует в списке
                                s.listChangeProp[targetID] = s.listChangeProp[targetID].filter(_id => _id != id) // Чистим старые ссылки
                            }
                            prop.propID = ''; // Затираем id свойства
                        }

                    }
                    if (prop?.propID) {
                        const {id, order, propID, targetID, type, value} = arrChangeProp?.[iProp];
                        s.listChangeProp[targetID].push(id)
                        s.listChangeProp[targetID] = [...new Set(s.listChangeProp[targetID])]
                    }

                    if (arrChangeProp?.[iProp]) Object.assign(arrChangeProp?.[iProp], prop);

                    console.log('prop', prop)
                    console.log('arrChangeProp', JSON.parse(JSON.stringify(arrChangeProp)))
                    console.log('listChangeProp', JSON.parse(JSON.stringify(s.listChangeProp)))
                })
                // get().updateListID();
            },
            deleteChangeProp: (iPart, iChapter, iScene, iEvent, iProp) => {
                set((s: IStoreBook) => {
                    let event = s.arrPart[iPart]?.arrChapter[iChapter]?.arrScene[iScene]?.arrEvent[iEvent];
                    // delete s.listID[event?.arrChangeProp[iProp].id];

                    // Подчищаем в listChangeProp
                    const {id, targetID} = event.arrChangeProp[iProp] as IChangeProperties;
                    delete s.listID[id]; // Чистим IDs
                    if (targetID) s.listChangeProp[targetID] = s.listChangeProp[targetID].filter((_id) => _id != id);

                    // Обновим order
                    event?.arrChangeProp.splice(iProp, 1);
                    const arrChangeProp = event?.arrChangeProp.map((changeProp: IChangeProperties, iProp: number) => {
                        const order = iPart * 1e12 + iChapter * 1e9 + iScene * 1e6 + iEvent * 1e3 + iProp;
                        return {...changeProp, order};
                    });

                    Object.assign(event?.arrChangeProp, arrChangeProp);

                    try {
                        console.log('arrChangeProp', JSON.parse(JSON.stringify(event.arrChangeProp)))
                        console.log('listChangeProp', JSON.parse(JSON.stringify(s.listChangeProp)))
                    } catch (e) {
                        console.log(e);
                    }
                })
                get().updateListID();
            },

            getItemByID: (id: string) => {
                const {iPart, iChapter, iScene, iCharacter, iItem, iEvent, iProp} = get().listID[id] || {};
                if (iPart === undefined) return null;

                const p = get().arrPart[iPart];
                if (iChapter === undefined) return p;

                const c = p.arrChapter[iChapter];
                if (iScene === undefined) return c;

                const sc = c.arrScene[iScene];
                if (iCharacter !== undefined)
                    return (iItem === undefined && iEvent === undefined) ? sc.arrCharacterID[iCharacter] : null;
                if (iItem !== undefined)
                    return iEvent === undefined ? sc.arrItemID[iItem] : null;
                if (iEvent !== undefined)
                    return iProp !== undefined
                        ? sc.arrEvent[iEvent]?.arrChangeProp[iProp]
                        : sc.arrEvent[iEvent];

                return sc;
            },

            updateListIDDebounce: debounce(() => get().updateListID(), 1000),

            updateListID: () => {
                set((s: IStoreBook) => { // Обновляем список id
                    const listID = {};
                    for (let iPart = 0; iPart < s.arrPart.length; iPart++) {
                        listID[s.arrPart[iPart].id] = {iPart} as IPath;

                        let arrChapter = s.arrPart[iPart].arrChapter;
                        let len = arrChapter.length;
                        for (let iChapter = 0; iChapter < len; iChapter++) {
                            listID[arrChapter[iChapter].id] = {iPart, iChapter} as IPath;

                            let arrScene = arrChapter[iChapter].arrScene;
                            let len = arrScene.length;

                            for (let iScene = 0; iScene < len; iScene++) {
                                let {arrCharacterID, arrEvent, arrItemID, id, sceneID} = arrScene[iScene];

                                listID[sceneID] = listID[id] = {iPart, iChapter, iScene} as IPath;

                                let lenCharacter = arrCharacterID.length;
                                let lenItem = arrItemID.length;
                                let lenEvent = arrEvent.length;

                                for (let iCharacter = 0; iCharacter < lenCharacter; iCharacter++) {
                                    const id = arrCharacterID[iCharacter];
                                    listID[id] = {iPart, iChapter, iScene, iCharacter} as IPath;
                                }
                                for (let iItem = 0; iItem < lenItem; iItem++) {
                                    const id = arrItemID[iItem];
                                    listID[id] = {iPart, iChapter, iScene, iItem} as IPath;
                                }
                                for (let iEvent = 0; iEvent < lenEvent; iEvent++) {
                                    const {arrChangeProp, desc, id, manner, objectID, subjectID, type} = arrEvent[iEvent] as IEvent;

                                    listID[subjectID] = listID[objectID] = listID[id] = {iPart, iChapter, iScene, iEvent} as IPath;

                                    let lenChangeProp = arrChangeProp.length;
                                    for (let iProp = 0; iProp < lenChangeProp; iProp++) {
                                        const {id, propID, targetID, value} = arrChangeProp[iProp] as IChangeProperties;

                                        listID[targetID] = listID[propID] = listID[id] = {
                                            iPart,
                                            iChapter,
                                            iScene,
                                            iEvent,
                                            iProp
                                        } as IPath;
                                    }
                                }
                            }
                        }
                    }
                    s.listID = {...listID};
                });
            },

            execByID: (tid, clb) => set((s: IStoreBook) => { // Находит любые id и удаляет
                const _arr = [];
                for (let iPart = 0; iPart < s.arrPart.length; iPart++) {
                    (s.arrPart[iPart].id == tid) && (_arr.push([s.arrPart, iPart]));

                    let arrChapter = s.arrPart[iPart].arrChapter;
                    let len = arrChapter.length;
                    for (let iChapter = 0; iChapter < len; iChapter++) {

                        (arrChapter[iChapter].id == tid) && (_arr.push([arrChapter, iChapter]));

                        let arrScene = arrChapter[iChapter].arrScene;
                        let len = arrScene.length;

                        for (let iScene = 0; iScene < len; iScene++) {
                            let {arrCharacterID, arrEvent, arrItemID, id, sceneID} = arrScene[iScene];

                            (id == tid || sceneID == tid) && (_arr.push([arrScene, iScene]));

                            let lenCharacter = arrCharacterID.length;
                            let lenItem = arrItemID.length;
                            let lenEvent = arrEvent.length;

                            for (let iCharacter = 0; iCharacter < lenCharacter; iCharacter++) {
                                const id = arrCharacterID[iCharacter];
                                (id == tid) && (_arr.push([arrCharacterID, iCharacter]));

                            }
                            for (let iItem = 0; iItem < lenItem; iItem++) {
                                const id = arrItemID[iItem];
                                (id == tid) && (_arr.push([arrCharacterID, iItem]));

                            }
                            for (let iEvent = 0; iEvent < lenEvent; iEvent++) {
                                const {arrChangeProp, desc, id, manner, objectID, subjectID, type} = arrEvent[iEvent] as IEvent;
                                (id == tid || objectID == tid || subjectID == tid) && (_arr.push([arrCharacterID, iEvent]));

                                let lenChangeProp = arrChangeProp.length;
                                for (let iChangeProp = 0; iChangeProp < lenChangeProp; iChangeProp++) {
                                    const {propID, targetID, value} = arrChangeProp[iChangeProp] as IChangeProperties;
                                    (id == propID || targetID == tid || subjectID == targetID) && (_arr.push([arrCharacterID, iEvent]));
                                }
                            }
                        }
                    }
                }
                _arr.forEach(([arr, i]) => {
                    clb(arr, i)
                });
            }),

            status: () => set((s) => {
                let event = s.arrPart[0]?.arrChapter[0]?.arrScene[0]?.arrEvent[0];
                console.log('arrChangeProp', JSON.parse(JSON.stringify(event.arrChangeProp)));
                console.log('listChangeProp', JSON.parse(JSON.stringify(s.listChangeProp)));
            }),
            test: (st: number) => set((s) => {

                if (!st) {
                    s.name = ""
                    s.arrPart = [
                        {
                            "id": "1UrpFF",
                            "name": "",
                            "arrChapter": [
                                {
                                    "id": "1UrpFI",
                                    "name": "",
                                    "arrScene": [
                                        {
                                            "aim": "",
                                            "arrCharacterID": [],
                                            "arrEvent": [
                                                {
                                                    "arrChangeProp": [],
                                                    "desc": "",
                                                    "id": "1UrpFR",
                                                    "manner": "",
                                                    "objectID": "",
                                                    "subjectID": "",
                                                    "type": "action"
                                                }
                                            ],
                                            "arrItemID": [],
                                            "id": "1UrpFK",
                                            "sceneID": "",
                                            "text": ""
                                        }
                                    ]
                                }
                            ]
                        }
                    ];
                    s.listID = {
                        "1UrpFF": {
                            "iPart": 0
                        },
                        "1UrpFI": {
                            "iPart": 0,
                            "iChapter": 0
                        },
                        "1UrpFK": {
                            "iPart": 0,
                            "iChapter": 0,
                            "iScene": 0
                        },
                        "": {
                            "iPart": 0,
                            "iChapter": 0,
                            "iScene": 0,
                            "iEvent": 0
                        },
                        "1UrpFR": {
                            "iPart": 0,
                            "iChapter": 0,
                            "iScene": 0,
                            "iEvent": 0
                        }
                    };
                    s.listChangeProp = {};
                    s.currScenePath = {
                        "iPart": 0,
                        "iChapter": 0,
                        "iScene": 0,
                        "iEvent": 0
                    };
                }
                if (st == 1) {
                    s.arrPart = [
                        {
                            "id": "1UrpFF",
                            "name": "",
                            "arrChapter": [
                                {
                                    "id": "1UrpFI",
                                    "name": "",
                                    "arrScene": [
                                        {
                                            "aim": "",
                                            "arrCharacterID": [],
                                            "arrEvent": [
                                                {
                                                    "arrChangeProp": [
                                                        {
                                                            "id": "1UrsrH",
                                                            "order": 0,
                                                            "targetID": "1UpYah",
                                                            "propID": "1UpYab",
                                                            "value": "",
                                                            "type": "scene"
                                                        }
                                                    ],
                                                    "desc": "",
                                                    "id": "1UrpFR",
                                                    "manner": "",
                                                    "objectID": "",
                                                    "subjectID": "",
                                                    "type": "action"
                                                }
                                            ],
                                            "arrItemID": [],
                                            "id": "1UrpFK",
                                            "sceneID": "",
                                            "text": ""
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                    s.listChangeProp = {
                        "1UpYah": [
                            "1UrsrH"
                        ]
                    };
                }
                if (st == 2) {
                    s.arrPart = [
                        {
                            "id": "1UrpFF",
                            "name": "",
                            "arrChapter": [
                                {
                                    "id": "1UrpFI",
                                    "name": "",
                                    "arrScene": [
                                        {
                                            "aim": "",
                                            "arrCharacterID": [],
                                            "arrEvent": [
                                                {
                                                    "arrChangeProp": [
                                                        {
                                                            "id": "1UrsrH",
                                                            "order": 0,
                                                            "targetID": "1UpYah",
                                                            "propID": "1UpYab",
                                                            "value": "a12",
                                                            "type": "scene"
                                                        },
                                                        {
                                                            "id": "1UryVO",
                                                            "order": 1,
                                                            "targetID": "1UpYah",
                                                            "propID": "1UpYab",
                                                            "value": "a123",
                                                            "type": "scene"
                                                        }
                                                    ],
                                                    "desc": "",
                                                    "id": "1UrpFR",
                                                    "manner": "",
                                                    "objectID": "",
                                                    "subjectID": "",
                                                    "type": "action"
                                                }
                                            ],
                                            "arrItemID": [],
                                            "id": "1UrpFK",
                                            "sceneID": "",
                                            "text": ""
                                        },
                                        {
                                            "aim": "",
                                            "arrCharacterID": [],
                                            "arrEvent": [
                                                {
                                                    "arrChangeProp": [
                                                        {
                                                            "id": "1UryW5",
                                                            "order": 1000000,
                                                            "targetID": "1UpYah",
                                                            "propID": "1UpYab",
                                                            "value": "a1234",
                                                            "type": "scene"
                                                        }
                                                    ],
                                                    "desc": "",
                                                    "id": "1UryW2",
                                                    "manner": "",
                                                    "objectID": "",
                                                    "subjectID": "",
                                                    "type": "action"
                                                }
                                            ],
                                            "arrItemID": [],
                                            "id": "1UryVX",
                                            "sceneID": "",
                                            "text": ""
                                        }
                                    ]
                                }
                            ]
                        }
                    ];
                    s.listChangeProp = {
                        "1UpYah": [
                            "1UrsrH",
                            "1UryVO",
                            "1UryW5"
                        ]
                    };
                }

            }),
            getData:
                async () => set((state) => ({arrPart: state.arrPart})),
        })),
        {
            name: 'book', version:
                0
        }
    )
)