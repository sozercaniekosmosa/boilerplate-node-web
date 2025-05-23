export interface IMap {
    name: string,
    title?: string,
    desc: string,
}

export interface ISceneGen {
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

export interface IStoreScenesGen {
    arrSceneGen: ISceneGen[],
    addSceneGen: (scene?: ISceneGen) => void,
    deleteSceneGen: (iScene: number) => void,
    updateSceneGen: (iScene: number, scene: ISceneGen) => void,
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
    object: string; // Обьект который производит действия
    subject: string; // Обьект испытывающий действие
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
    name: string,
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