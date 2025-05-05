import React, {useEffect} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ButtonEx from "../Auxiliary/ButtonEx.tsx";
import {create} from "zustand/react";
import {Tab, Tabs} from "../Auxiliary/Tabs.tsx";
import {persist} from "zustand/middleware";
import clsx from "clsx";
import {generateUID} from "../../lib/utils.ts";
import {immer} from "zustand/middleware/immer";

export const stButton = {width: '1.8em', height: '1.8em'}
export const clButton = ' btn btn-sm flex-grow-0 d-flex justify-content-center align-items-center'

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
                            arrAction: [
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

interface ISceneGen {
    id: string,
    name: string,
    pointOfView: string,
    location: string,
    detailsEnv: string,
    time: string,
    mood: string,
    sensors: string,
    symbols: string
}

interface IStoreScenesGen {
    arrScenes: ISceneGen[],
    add: (scene: ISceneGen) => void,
    remove: (sceneName: string) => void,
    update: (scene: ISceneGen, sceneName: string) => void,
    removeAll: () => void,
    fetch: (sceneName: string) => Promise<void>,
}

const useStoreScenesGen = create<IStoreScenesGen>((set) => ({
        arrScenes: [],
        add: (scene: ISceneGen) => set((state) => ({arrScenes: [...state.arrScenes, scene]})),
        remove: (sceneName: string) => set((state) => ({arrScenes: [...state.arrScenes.filter(({name}) => name != sceneName)]})),
        update: (scene: ISceneGen, sceneName: string) => set((state) => ({arrScenes: [...state.arrScenes.map((it) => it.name != sceneName ? scene : it)]})),
        removeAll: () => set({arrScenes: []}),
        fetch: async () => set({arrScenes: []})
    })
)

interface ICharacter {
    name: string
}

interface IItem {
    name: string
}

type ITypeAction = "реплика" | "свойство";

interface IAction {
    type: ITypeAction;
    object: string; // обьект
}

interface IReplica extends IAction {
    type: "реплика";
    manner: string; // Манера с которой произносится реплика
    action: string;
}

interface IChangeProperties extends IAction {
    type: "свойство";
    propKey: string; // Имя свойства
    propVal: string; // Значение свойства
}

type TAction = IReplica | IChangeProperties;

interface IScene {
    id: string,
    name: string,
    scene: string,
    arrCharacter: ICharacter[],
    arrItem: IItem[],
    arrAction: TAction[]
}

interface IChapter {
    id: string,
    name: string,
    arrScene: IScene[]
}

interface IPart {
    id: string,
    name: string,
    arrChapter: IChapter[]
}

interface IStoreBook {
    arrPart: IPart[];

    // Actions for parts
    addPart: (part?: IPart) => void;
    updatePart: (id: string, updatedPart: Partial<IPart>) => void;
    deletePart: (id: string) => void;

    // Actions for chapters
    addChapter: (partId: string, chapter?: IChapter) => void;
    updateChapter: (partId: string, chapterId: string, updatedChapter: Partial<IChapter>) => void;
    deleteChapter: (partId: string, chapterId: string) => void;

    // Actions for scenes
    addScene: (partId: string, chapterId: string, scene?: IScene) => void;
    updateScene: (partId: string, chapterId: string, sceneId: string, updatedScene: Partial<IScene>) => void;
    deleteScene: (partId: string, chapterId: string, sceneId: string) => void;

    // Actions for characters
    addCharacter: (partId: string, chapterId: string, sceneId: string, character?: ICharacter) => void;
    updateCharacter: (partId: string, chapterId: string, sceneId: string, index: number, updatedCharacter: Partial<ICharacter>) => void;
    deleteCharacter: (partId: string, chapterId: string, sceneId: string, index: number) => void;

    // Actions for items
    addItem: (partId: string, chapterId: string, sceneId: string, item?: IItem) => void;
    updateItem: (partId: string, chapterId: string, sceneId: string, index: number, updatedItem: Partial<IItem>) => void;
    deleteItem: (partId: string, chapterId: string, sceneId: string, index: number) => void;

    // Actions for actions
    addAction: (partId: string, chapterId: string, sceneId: string, action?: TAction) => void;
    updateAction: (partId: string, chapterId: string, sceneId: string, index: number, updatedAction: Partial<TAction>) => void;
    deleteAction: (partId: string, chapterId: string, sceneId: string, index: number) => void;

    getData: () => Promise<void>,
}

export const useStoreBook = create<IStoreBook>()(
    immer((set) => ({
        arrPart: [],

        // Parts actions
        addPart: (part) => set((state) => {
            state.arrPart.push(part ?? {id: generateUID(), name: '', arrChapter: []});
        }),

        updatePart: (id, updatedPart) => set((state) => {
            const partIndex = state.arrPart.findIndex(p => p.id === id);
            if (partIndex !== -1) {
                state.arrPart[partIndex] = {...state.arrPart[partIndex], ...updatedPart};
            }
        }),

        deletePart: (id) => set((state) => {
            state.arrPart = state.arrPart.filter(p => p.id !== id);
        }),

        // Chapters actions
        addChapter: (partId, chapter) => set((state) => {
            const part = state.arrPart.find(p => p.id === partId);
            if (part) {
                part.arrChapter.push(chapter ?? {id: generateUID(), name: '', arrScene: []});
            }
        }),

        updateChapter: (partId, chapterId, updatedChapter) => set((state) => {
            const part = state.arrPart.find(p => p.id === partId);
            if (part) {
                const chapterIndex = part.arrChapter.findIndex(c => c.id === chapterId);
                if (chapterIndex !== -1) {
                    part.arrChapter[chapterIndex] = {...part.arrChapter[chapterIndex], ...updatedChapter};
                }
            }
        }),

        deleteChapter: (partId, chapterId) => set((state) => {
            const part = state.arrPart.find(p => p.id === partId);
            if (part) {
                part.arrChapter = part.arrChapter.filter(c => c.id !== chapterId);
            }
        }),

        // Scenes actions
        addScene: (partId, chapterId, scene) => set((state) => {
            const part = state.arrPart.find(p => p.id === partId);
            if (part) {
                const chapter = part.arrChapter.find(c => c.id === chapterId);
                if (chapter) {
                    chapter.arrScene.push(scene);
                }
            }
        }),

        updateScene: (partId, chapterId, sceneId, updatedScene) => set((state) => {
            const part = state.arrPart.find(p => p.id === partId);
            if (part) {
                const chapter = part.arrChapter.find(c => c.id === chapterId);
                if (chapter) {
                    const sceneIndex = chapter.arrScene.findIndex(s => s.id === sceneId);
                    if (sceneIndex !== -1) {
                        chapter.arrScene[sceneIndex] = {...chapter.arrScene[sceneIndex], ...updatedScene};
                    }
                }
            }
        }),

        deleteScene: (partId, chapterId, sceneId) => set((state) => {
            const part = state.arrPart.find(p => p.id === partId);
            if (part) {
                const chapter = part.arrChapter.find(c => c.id === chapterId);
                if (chapter) {
                    chapter.arrScene = chapter.arrScene.filter(s => s.id !== sceneId);
                }
            }
        }),

        // Characters actions
        addCharacter: (partId, chapterId, sceneId, character) => set((state) => {
            const scene = findScene(state, partId, chapterId, sceneId);
            if (scene) {
                scene.arrCharacter.push(character);
            }
        }),

        updateCharacter: (partId, chapterId, sceneId, index, updatedCharacter) => set((state) => {
            const scene = findScene(state, partId, chapterId, sceneId);
            if (scene && index >= 0 && index < scene.arrCharacter.length) {
                scene.arrCharacter[index] = {...scene.arrCharacter[index], ...updatedCharacter};
            }
        }),

        deleteCharacter: (partId, chapterId, sceneId, index) => set((state) => {
            const scene = findScene(state, partId, chapterId, sceneId);
            if (scene && index >= 0 && index < scene.arrCharacter.length) {
                scene.arrCharacter.splice(index, 1);
            }
        }),

        // Items actions
        addItem: (partId, chapterId, sceneId, item) => set((state) => {
            const scene = findScene(state, partId, chapterId, sceneId);
            if (scene) {
                scene.arrItem.push(item);
            }
        }),

        updateItem: (partId, chapterId, sceneId, index, updatedItem) => set((state) => {
            const scene = findScene(state, partId, chapterId, sceneId);
            if (scene && index >= 0 && index < scene.arrItem.length) {
                scene.arrItem[index] = {...scene.arrItem[index], ...updatedItem};
            }
        }),

        deleteItem: (partId, chapterId, sceneId, index) => set((state) => {
            const scene = findScene(state, partId, chapterId, sceneId);
            if (scene && index >= 0 && index < scene.arrItem.length) {
                scene.arrItem.splice(index, 1);
            }
        }),

        // Actions (TAction) operations
        addAction: (partId, chapterId, sceneId, action) => set((state) => {
            const scene = findScene(state, partId, chapterId, sceneId);
            if (scene) {
                scene.arrAction.push(action);
            }
        }),

        updateAction: (partId, chapterId, sceneId, index, updatedAction) => set((state) => {
            const scene = findScene(state, partId, chapterId, sceneId);
            if (scene && index >= 0 && index < scene.arrAction.length) {
                const currentAction = scene.arrAction[index];

                // Проверяем тип текущего действия и обновлений
                if (currentAction.type === "реплика" && updatedAction.type === "реплика") {
                    scene.arrAction[index] = {
                        ...currentAction,
                        ...updatedAction
                    };
                } else if (currentAction.type === "свойство" && updatedAction.type === "свойство") {
                    scene.arrAction[index] = {
                        ...currentAction,
                        ...updatedAction
                    };
                }
                // Можно добавить else для обработки ошибки или изменения типа
            }
        }),

        deleteAction: (partId, chapterId, sceneId, index) => set((state) => {
            const scene = findScene(state, partId, chapterId, sceneId);
            if (scene && index >= 0 && index < scene.arrAction.length) {
                scene.arrAction.splice(index, 1);
            }
        }),

        getData: async () => set({arrPart})
    }))
);

    // Helper function to find a scene
    function findScene(state: IStoreBook, partId: string, chapterId: string, sceneId: string): IScene | undefined {
        const part = state.arrPart.find(p => p.id === partId);
        if (!part) return undefined;
    
        const chapter = part.arrChapter.find(c => c.id === chapterId);
        if (!chapter) return undefined;
    
        return chapter.arrScene.find(s => s.id === sceneId);
    }

interface IStoreFolding {
    listFolding: { [key: string]: boolean };
    isHide: (id: string) => boolean;
    switchVisibility: (id: string) => void;
}

const useStoreFolding = create<IStoreFolding>()(persist((set, get) => ({
        listFolding: {},
        isHide: (id) => get().listFolding[id],
        switchVisibility: (id) => set(state => ({
            listFolding: {
                ...state.listFolding,
                [id]: !state.listFolding[id]
            }
        })),
    }),
    {
        name: 'folding'
    },
))

const arrMapOfItem = [
    {name: 'name', desc: 'Название'},
    {name: 'names', desc: 'Другие названия/имена'},
    {
        name: 'category',
        desc: 'Категория объекта для быстрой классификации (макгаффин, фоновый элемент, артефакт, символ)'
    },

    // Драматургическая механика
    {name: 'plotDriver', desc: 'Уровень влияния на сюжет (не влияет, средне, сильное)'},
    {name: 'evolution', desc: 'По сюжету например: трансформируется из макгаффина в символ искупления'},
    {name: 'triggers', desc: 'События, которые объект инициирует/меняет'},

    // Семиотический каркас
    {name: 'surface', desc: 'Первичная ассоциация'},
    {name: 'latent', desc: 'Что раскрывается при анализе'},
    {name: 'meta', desc: 'Связь с темами произведения'},
    {name: 'paradox', desc: 'Например: ключ, который открывает только закрытые сердца'},

    // Сенсорная интеграция
    {name: 'visual', desc: 'Пример: "Позолота, стирающаяся на изгибах'},
    {name: 'tactile', desc: 'Пример: "Холодный металл с шершавыми гранями'},
    {name: 'sound', desc: 'Пример: "Глухой стук при падении'},


    // Связи с другими элементами истории
    {name: 'characters', desc: 'Связь с персонажами'},
    {name: 'locations', desc: 'Локации появления'},
    {name: 'events', desc: 'Ключевые события с участием'},

    {
        name: 'interactionType',
        desc: 'Интерактивность с персонажами: Тактильный контакт, Визуальное упоминание, Объект желания'
    },

    // Физические характеристики
    {name: 'weight', desc: 'Вес'},
    {name: 'temperature', desc: 'Температура'},
    {name: 'dimensions', desc: 'Длина, ширина, высота'},
    {name: 'form', desc: 'Форма, геометрическая конфигурация'},
]
const arrMapOfCharacter = [
    {name: 'name', desc: 'Рабочее имя персонажа'},
    {name: 'names', desc: 'Возможные имена'},

    {name: 'inPast', desc: 'История жизни в прошлом'},
    {name: 'now', desc: 'Текущая ситуация в жизни'},


    {name: 'relationships', desc: 'Отношения (друзья, семья, знакомые, коллеги)'},

    {name: 'goalsMotivation', desc: 'Цели и мотвация'},
    {name: 'secretsMotives', desc: 'Скрытые цели и мотвация'},
    {name: 'morality', desc: 'Моральные аспекты личности'},
    {name: 'courage', desc: 'Шкала 0-10: от трусости до безрассудства'},
    {name: 'loyalty', desc: 'Шкала 0-10: вероятность предательства'},

    // Эмоциональные реакции и устойчивость
    {name: 'empathy', desc: 'Способность к сопереживанию (0-10)'},
    {name: 'temper', desc: 'Тип темперамента'},
    {name: 'resilience', desc: 'Устойчивость к стрессу (0 = сломление, 10 = сталь)'},

    // Социальное взаимодействие
    {name: 'charisma', desc: 'Влияние на других (0-10)'},
    {name: 'isLeader', desc: 'Лидерские качества'},
    {name: 'trustInOthers', desc: '0 = параноик, 10 = наивный'},


    // Интеллект и творчество
    {name: 'abilities', desc: 'Интеллектуальные и творческие способности'},
    {name: 'creativity', desc: '0 = шаблонное мышление, 10 = новатор'},
    {name: 'isAnalytical', desc: 'Преобладание логики над эмоциями'},
    {name: 'curiosity', desc: '0 = консерватор, 10 = исследователь'},

    // Особенности
    {name: 'isSarcastic', desc: 'Склонность к сарказму'},
    {name: 'habits', desc: 'Привычки'},
    {name: 'gestures', desc: 'Типичные жесты'},
    {name: 'phobias', desc: 'список страхов'},
    {name: 'InternalConflicts', desc: 'Внутренние конфликты'},

    {name: 'age', desc: 'Возраст'},
    {name: 'sex', desc: 'Биологический пол'},
    {name: 'height', desc: 'Рост в сантиметрах'},
    {name: 'physique', desc: 'Телосложение'},
    {name: 'hairColor', desc: 'Цвет волос'},
    {name: 'hairLength', desc: 'Длина волос'},
    {name: 'hairStyle', desc: 'Причёска'},
    {name: 'eyesColor', desc: 'Цвет глаз'},
    {name: 'features', desc: 'Особенности'},

    // Стиль и визуальные особенности

    {name: 'clothingStyle', desc: 'Стиль одежды'},
    {name: 'clothingCondition', desc: 'Состояние одежды'},
    {name: 'clothingItems', desc: 'Предметы одежды'},
    {name: 'clothingAccessories', desc: 'Аксессуары'},

    // Уникальные черты

    {name: 'scarsInjuries', desc: 'Шрамы и травмы'},
    {name: 'tattoos', desc: 'Татуирвоки'},
    {name: 'peculiarities', desc: 'Особенности (близко посаженные глаза, выдющийся подбородок и т.д.)'},

    {name: 'have', desc: 'Предметы при себе'},
    {name: 'notes', desc: 'Текущие заметки'},

    // Динамические характеристики
    {name: 'posture', desc: 'Осанка'},
    {name: 'timbreVoice', desc: 'Тембр голоса'},
    {name: 'speakingRate', desc: 'Скорость речи'},
]
const arrMapOfScene = [
    {name: 'name', desc: 'Название сцены'},
    {
        name: 'location',
        desc: 'Место действия:\n— Географическое расположение (город, джунгли).\n— Сооружение (дом, помещение).\n— Место.'
    },
    {
        name: 'detailsEnv',
        desc: 'Детали окружения:\n— Интерьер (мебель, декор, предметы).\n— Природа (деревья, река, животные).\n— Климатические условия (дождь, жара, туман).\n— Освещение (сумерки, яркий свет, свечи).\n— Социальная обстановка (богатый квартал, трущобы, замок).'
    },
    {
        name: 'time',
        desc: 'Время действия:\n— Хронологический период (историческая эпоха, современность).\n— Время года, суток (зима, ночь, рассвет).\n— Сезонные особенности (лето, зима).'
    },
    {
        name: 'mood',
        desc: 'Настроение, тон:\n— Эмоциональная окраска (радость, таинственность, тревожность).\n— Использование метафор, сравнений для создания образов.'
    },
    {
        name: 'sensors',
        desc: 'Сенсорные детали:\n— Зрительные образы (цвета, формы, движения).\n— Звуки (шум ветра, тишина, музыка).\n— Запахи, тактильные ощущения (аромат цветов, холод).'
    },
    {
        name: 'symbols',
        desc: 'Символизм и подтекст:\n— Символические элементы несущие скрытый смысл (разбитое зеркало, часы, старый портрет, гроза как символ кризиса).\n— Аллегории, намёки на темы произведения.'
    }
]

const Chapters = ({partID, arrChapter}) => {

    const {isHide, switchVisibility} = useStoreFolding()
    const addScene = useStoreBook(state => state.addScene);
    const deleteChapter = useStoreBook(state => state.deleteChapter);
    const updateChapter = useStoreBook(state => state.updateChapter);

    return <>
        {arrChapter.map((chapter, idi) => {
            const {id, name, arrScene} = chapter as IChapter;
            return <div key={idi} className="flex-column border border-black/20 rounded p-1">
                <div className="flex flex-row gap-1">
                    <ButtonEx className={clsx(isHide(id) ? 'bi-plus-square' : 'bi-square')}
                              onClick={() => switchVisibility(id)}/>
                    <ButtonEx className={clsx("btn-secondary bi-plus-circle")}
                              onClick={() => addScene(partID, id)}/>
                    <ButtonEx className={clsx("btn-danger btn-sm bi-x-lg flex-grow-0")} description="Удалить"
                              onConfirm={() => deleteChapter(partID, id)}/>
                    <input type="text" value={name}
                           onChange={({target}) => updateChapter(partID, id, {name: target.value})}
                           placeholder="Введите название Главы"/>
                </div>
                {/*{!isHide(id) && <Chapters partID={id} arrChapter={arrChapter}></Chapters>}*/}
            </div>
        })}
    </>
}

const Parts = () => {

    const arrPart = useStoreBook(state => state.arrPart);
    const addPart = useStoreBook(state => state.addPart);
    const updatePart = useStoreBook(state => state.updatePart);
    const deletePart = useStoreBook(state => state.deletePart);
    const addChapter = useStoreBook(state => state.addChapter);
    const {isHide, switchVisibility} = useStoreFolding()

    useEffect(() => {
        useStoreBook.getState().getData();
        // window.useStoreBook = useStoreBook;
    }, []);

    return <div className="flex flex-col gap-1 p-1 mb-1 rounded-md border border-black/20">
        <div className="flex flex-row gap-1">
            <ButtonEx className={clsx("btn-secondary bi-plus-circle")} onClick={() => addPart()}/>
        </div>
        {arrPart.map(((part, idi) => {
            const {id, name, arrChapter} = part;

            return <div key={idi} className="flex-column border border-black/20 rounded p-1">
                <div className="flex flex-row gap-1">
                    <ButtonEx className={clsx(isHide(id) ? 'bi-plus-square' : 'bi-square')}
                              onClick={() => switchVisibility(id)}/>
                    <ButtonEx className={clsx("btn-secondary bi-plus-circle")} onClick={() => addChapter(id)}/>
                    <ButtonEx className={clsx("btn-danger btn-sm bi-x-lg flex-grow-0")} description="Удалить"
                              onConfirm={() => deletePart(id)}/>
                    <input type="text" value={name} onChange={({target}) => updatePart(id, {name: target.value})}
                           placeholder="Введите название Части"/>
                </div>
                {!isHide(id) && <Chapters partID={id} arrChapter={arrChapter}></Chapters>}
            </div>

        }))
        }
    </div>
}

const Story: React.FC<any> = () => {

    return <Tabs defaultActiveKey="plan" className="">
        <Tab eventKey="plan" title="План" style={{flex: 1}} className="h-full p-1">
            <Parts/>
        </Tab>
        <Tab eventKey="gen-scene" title="Сцена" style={{flex: 1}} className="h-100">
            {/*<GenScene book={book} setBook={setBook}/>*/}
        </Tab>
        <Tab eventKey="gen-character" title="Персонаж" style={{flex: 1}} className="h-100">
            {/*<GenCharacter book={book} setBook={setBook}/>*/}
        </Tab>
    </Tabs>
};

export default Story;