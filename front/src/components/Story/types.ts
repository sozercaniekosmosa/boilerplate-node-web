export interface IMapItem {
    name: string;
    type?: string;
    title?: string;
    desc: string;
    text?: string;
}

export interface IMap {
    id: string;
    name: string;
    arrMap: IMapItem[];
}

export interface ISceneGen {
    id: string;
    name: string; //Название сцены
    location: string; //Место
    detailsEnv: string; //Детали окружения
    time: string; //Время действия
    mood: string; // Настроение
    sensors: string; //Сенсорные детали
    symbols: string; //Символические отсылки и намеки
}

export interface ICharacterGen {
    id: string;
    name: string; //Рабочее имя персонажа
    names: string; //Возможные имена

    inPast: string; //История жизни в прошлом
    now: string; //Текущая ситуация в жизни


    relationships: string; //Отношения (друзья, семья, знакомые, коллеги)

    goalsMotivation: string; //Цели и мотвация
    secretsMotives: string; //Скрытые цели и мотвация
    morality: string; //Моральные аспекты личности
    courage: string; //Шкала 0-10: от трусости до безрассудства
    loyalty: string; //Шкала 0-10: вероятность предательства

    // Эмоциональные реакции и устойчивость
    empathy: string; //Способность к сопереживанию (0-10)
    temper: string; //Тип темперамента
    resilience: string; //Устойчивость к стрессу (0 = сломление, 10 = сталь)

    // Социальное взаимодействие
    charisma: string; //Влияние на других (0-10)
    isLeader: string; //Лидерские качества
    trustInOthers: string; //0 = параноик, 10 = наивный


    // Интеллект и творчество
    abilities: string; //Интеллектуальные и творческие способности
    creativity: string; //0 = шаблонное мышление, 10 = новатор
    isAnalytical: string; //Преобладание логики над эмоциями
    curiosity: string; //0 = консерватор, 10 = исследователь

    // Особенности
    isSarcastic: string; //Склонность к сарказму
    habits: string; //Привычки
    gestures: string; //Типичные жесты
    phobias: string; //список страхов
    InternalConflicts: string; //Внутренние конфликты

    age: string; //Возраст
    sex: string; //Пол
    height: string; //Рост в сантиметрах
    physique: string; //Телосложение
    hairColor: string; //Цвет волос
    hairLength: string; //Длина волос
    hairStyle: string; //Причёска
    eyesColor: string; //Цвет глаз
    features: string; //Особенности

    // Стиль и визуальные особенности

    clothingStyle: string; //Стиль одежды
    clothingCondition: string; //Состояние одежды
    clothingItems: string; //Предметы одежды
    clothingAccessories: string; //Аксессуары

    // Уникальные черты

    scarsInjuries: string; //Шрамы и травмы
    tattoos: string; //Татуирвоки
    peculiarities: string; //Особенности (близко посаженные глаза, выдющийся подбородок и т.д.)

    have: string; //Предметы при себе
    notes: string; //Текущие заметки

    // Динамические характеристики
    posture: string; //Осанка
    timbreVoice: string; //Тембр голоса
    speakingRate: string; //Скорость речи
}

export interface IStoreCharacterGen {
    arrCharacterGen: ICharacterGen[],
    listID: { [key: string]: number },
    addCharacterGen: (scene?: ICharacterGen) => void,
    deleteCharacterGen: (iCharacter: number) => void,
    updateCharacterGen: (iCharacter: number, scene: ICharacterGen) => void,
    removeAllCharactersGen: () => void,
    getData: () => Promise<void>,
}

export interface IStoreScenesGen {
    arrSceneGen: IMap[],
    listID: { [key: string]: number },
    addSceneGen: (scene?: IMap) => void,
    deleteSceneGen: (iScene: number) => void,
    updateSceneGen: (iScene: number, scene: IMap) => void,
    removeAllScenesGen: () => void,
    getData: () => Promise<void>,
}

export interface ICharacter {
    id: string
    name: string
}

export interface IItem {
    id: string
    name: string
}

export interface IEventBase {
    id: string
    type: 'replica' | 'action' | 'change-prop'
    subject: string; // Обьект который производит действия
    object: string; // Обьект испытывающий действие
}

export interface IReplica extends IEventBase {
    manner: string; // Манера с которой произносится реплика
    text: string; // Текст реплики
}

export interface IChangeProperties extends IEventBase {
    key: string; // Имя свойства
    value: string; // Значение свойства
}

export interface IAction extends IEventBase {
    desc: string; //описание действия
}

export type TEvent = IReplica | IAction | IChangeProperties;

export interface IScene {
    id: string,
    sceneID: string,
    aim: string, //цель
    text: string,
    arrCharacter: ICharacter[],
    arrItem: IItem[],
    arrEvent: TEvent[]
}

export interface IChapter {
    id: string,
    name: string,
    arrScene: IScene[]
}

export interface IPart {
    id: string,
    name: string,
    arrChapter: IChapter[]
}

export interface IPath {
    iPart?: number,
    iChapter?: number,
    iScene?: number,
    iEvent?: number
}

export interface IStoreBook {
    name: string;
    arrPart: IPart[];
    currScenePath: IPath | null;

    // Other actions
    setCurrentScenePath: ({iPart, iChapter, iScene, iEvent}: IPath) => void;
    setName: (name: string) => void;

    // Actions for parts
    addPart?: (part?: IPart) => void;
    updatePart?: (index: number, updatedPart: Partial<IPart>) => void;
    deletePart?: (index: number) => void;

    // Actions for chapters
    addChapter?: (partIndex: number, chapter?: IChapter) => void;
    updateChapter?: (partIndex: number, chapterIndex: number, updatedChapter: Partial<IChapter>) => void;
    deleteChapter?: (partIndex: number, chapterIndex: number) => void;

    // Actions for scenes
    addScene?: (partIndex: number, chapterIndex: number, scene?: IScene) => void;
    updateScene?: (partIndex: number, chapterIndex: number, sceneIndex: number, updatedScene: Partial<IScene>) => void;
    deleteScene?: (partIndex: number, chapterIndex: number, sceneIndex: number) => void;

    // Actions for characters
    addCharacter?: (partIndex: number, chapterIndex: number, sceneIndex: number, character?: ICharacter) => void;
    updateCharacter?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number, updatedCharacter: Partial<ICharacter>) => void;
    deleteCharacter?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number) => void;

    // Actions for items
    addItem?: (partIndex: number, chapterIndex: number, sceneIndex: number, item?: IItem) => void;
    updateItem?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number, updatedItem: Partial<IItem>) => void;
    deleteItem?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number) => void;

    // Actions for events (TEvent)
    addEvent?: (partIndex: number, chapterIndex: number, sceneIndex: number, event?: TEvent) => void;
    updateEvent?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number, updatedEvent: Partial<TEvent>) => void;
    deleteEvent?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number) => void;

    getData: () => Promise<void>;
}

export interface IStoreFolding {
    listFolding: { [key: string]: boolean };
    isHide: (id: string) => boolean;
    switchVisibility: (id: string) => void;
}