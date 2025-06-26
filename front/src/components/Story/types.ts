export interface IMapPropBase {
    section?: boolean;
    title?: string;
    desc?: string;
    value?: string;
    list?: string[];
    ext?: boolean;
    range?: [number, number];

    disabledExt?: boolean;
}

export interface IMapProp extends IMapPropBase {
    id?: string;
    // isChange?: boolean;
}

export interface IMap {
    id: string;
    name: string;
    desc: string; // Общее описание/смысл
    arrMapProp: IMapProp[];
}

// Store gen
export interface IStoreGen {
    arrGen: IMap[],
    listID: { [key: string]: any },
    // listPropID: { [key: string]: [number, number] },
    addGen: (item?: IMap) => void,
    deleteGen: (i: number) => void,
    updateGen: (i: number, prop: IMap) => void
    updateGenProp: (i: number, iItem: number, prop: IMapProp) => void
    addGenProp: (i: number, prop?: IMapProp) => void
    deleteGenProp: (i: number, iProp: number) => void

    updateListID: () => void,

    getData: () => Promise<void>,
}

export type TProp = 'scene' | 'character' | 'item' | null;

//Book
export interface IChangeProperties {
    id: string;
    order: number | null;
    type: TProp;
    targetID: string; // ID объект свойства которого меняем
    propID: string; // ID свойства
    value: string; // Значение свойства
}

export interface IEvent {
    id: string
    type: 'replica' | 'action';
    subjectID: string; // Обьект который производит действия
    objectID: string; // Обьект испытывающий действие
    manner: string; // Манера с которой производится действие/реплика
    desc: string; // Текст описание реплики/действия
    arrChangeProp: IChangeProperties[];
}

export interface IScene {
    id: string,
    sceneID: string,
    aim: string,    // Цель
    text: string,   // Текст литературно описывающий сцену
    arrCharacterID: string[],
    arrItemID: string[],
    arrEvent: IEvent[]
    listID: { [key: string]: any }, //
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
    iCharacter?: number,
    iItem?: number,
    iEvent?: number
    iProp?: number
}

// Store book
export interface IStoreBook {
    name: string;
    arrPart: IPart[];
    listID: { [key: string]: IPath; },
    listChangeProp: { [objectID: string]: string[]; },
    listStatusDisplay: { [objectID: string]: { [srcID: string]: boolean }, },
    currScenePath: IPath | null;

    // Other aux
    setCurrentScenePath: ({iPart, iChapter, iScene, iEvent}: IPath) => void;
    setName: (name: string) => void;

    // Actions for shown props
    setStatusDisplay: (idProp: string, idUsedIn: string, status: boolean) => void;
    deleteStatusDisplay: (id: string) => void;

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
    addCharacterID?: (partIndex: number, chapterIndex: number, sceneIndex: number, character?: string) => void;
    updateCharacterID?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number, updatedCharacter: Partial<string>) => void;
    deleteCharacterID?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number) => void;

    // Actions for items
    addItemID?: (partIndex: number, chapterIndex: number, sceneIndex: number, item?: string) => void;
    updateItemID?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number, updatedItem: Partial<string>) => void;
    deleteItemID?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number) => void;

    // Actions for events
    addEvent?: (partIndex: number, chapterIndex: number, sceneIndex: number, event?: IEvent) => void;
    updateEvent?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number, updatedEvent: Partial<IEvent>) => void;
    deleteEvent?: (partIndex: number, chapterIndex: number, sceneIndex: number, index: number) => void;

    // Actions for change props
    addChangeProp: (iPart: number, iChapter: number, iScene: number, iEvent: number, prop?: IChangeProperties) => void;
    updateChangeProp: (iPart: number, iChapter: number, iScene: number, iEvent: number, iProp: number, v) => void;
    deleteChangeProp: (iPart: number, iChapter: number, iScene: number, iEvent: number, iProp: number) => void;

    getItemByID: (id: string) => any;

    updateListIDDebounce?: () => void;
    updateListID?: () => void;
    execByID?: (targetID: string, clb: (arr: any[], index: number) => void) => void;

    status: () => void;
    test: (s: number) => void;
    getData: () => Promise<void>;
}

// Store state
export interface IStoreState {
    listState: { [key: string]: boolean };
    isState: (id: string) => boolean;
    switchState: (id: string) => void;
    setState: (id: string, val: boolean) => void;
}

// ...
export interface IStoreData {
    data: { [key: string]: any };
    setData: (id: string, val: any) => void;
}