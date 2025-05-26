// @ts-ignore
import {IMapProp} from "./types.ts";
import {generateUID, getID} from "../../lib/utils.ts";

export const arrMapOfItem: IMapProp[] = [
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
export const arrMapOfCharacter: IMapProp[] = [
    {name: 'name', title: 'Рабочее имя персонажа', desc: 'Рабочее имя персонажа'},
    {name: 'names', title: 'Возможные имена', desc: 'Возможные имена'},

    {name: 'inPast', title: 'История жизни в прошлом', desc: 'История жизни в прошлом'},
    {name: 'now', title: 'Текущая ситуация в жизни', desc: 'Текущая ситуация в жизни'},


    {
        name: 'relationships',
        title: 'Отношения (друзья, семья, знакомые, коллеги)',
        desc: 'Отношения (друзья, семья, знакомые, коллеги)'
    },

    {name: 'goalsMotivation', title: 'Цели и мотвация', desc: 'Цели и мотвация'},
    {name: 'secretsMotives', title: 'Скрытые цели и мотвация', desc: 'Скрытые цели и мотвация'},
    {name: 'morality', title: 'Моральные аспекты личности', desc: 'Моральные аспекты личности'},
    {
        name: 'courage',
        title: 'Шкала 0-10: от трусости до безрассудства',
        desc: 'Шкала 0-10: от трусости до безрассудства'
    },
    {name: 'loyalty', title: 'Шкала 0-10: вероятность предательства', desc: 'Шкала 0-10: вероятность предательства'},

    // Эмоциональные реакции и устойчивость
    {name: 'empathy', title: 'Способность к сопереживанию (0-10)', desc: 'Способность к сопереживанию (0-10)'},
    {name: 'temper', title: 'Тип темперамента', desc: 'Тип темперамента'},
    {
        name: 'resilience',
        title: 'Устойчивость к стрессу (0 = сломление, 10 = сталь)',
        desc: 'Устойчивость к стрессу (0 = сломление, 10 = сталь)'
    },

    // Социальное взаимодействие
    {
        name: 'charisma',
        title: 'Харизма влияние на других (0-10)',
        desc: 'Влияние на других, способность мобилизовать и вести за собой'
    },
    {name: 'trustInOthers', title: '0 = параноик, 10 = наивный', desc: '0 = параноик, 10 = наивный'},


    // Интеллект и творчество
    {
        name: 'abilities',
        title: 'Интеллектуальные и творческие способности',
        desc: 'Интеллектуальные и творческие способности'
    },
    {name: 'creativity', title: '0 = шаблонное мышление, 10 = новатор', desc: '0 = шаблонное мышление, 10 = новатор'},
    {name: 'isAnalytical', title: 'Преобладание логики над эмоциями', desc: 'Преобладание логики над эмоциями'},
    {name: 'curiosity', title: '0 = консерватор, 10 = исследователь', desc: '0 = консерватор, 10 = исследователь'},

    // Особенности
    {name: 'isSarcastic', title: 'Склонность к сарказму', desc: 'Склонность к сарказму'},
    {name: 'habits', title: 'Привычки', desc: 'Привычки'},
    {name: 'gestures', title: 'Типичные жесты', desc: 'Типичные жесты'},
    {name: 'phobias', title: 'список страхов', desc: 'список страхов'},
    {name: 'InternalConflicts', title: 'Внутренние конфликты', desc: 'Внутренние конфликты'},

    // Тело
    {name: 'age', title: 'Возраст', desc: 'Возраст'},
    {name: 'sex', title: 'Пол', desc: 'Пол'},
    {name: 'height', title: 'Рост в сантиметрах', desc: 'Рост в сантиметрах'},
    {name: 'physique', title: 'Телосложение', desc: 'Телосложение'},
    {name: 'hairColor', title: 'Цвет волос', desc: 'Цвет волос'},
    {name: 'hairLength', title: 'Длина волос', desc: 'Длина волос'},
    {name: 'hairStyle', title: 'Причёска', desc: 'Причёска'},
    {name: 'eyesColor', title: 'Цвет глаз', desc: 'Цвет глаз'},
    {name: 'features', title: 'Особенности', desc: 'Особенности'},
    {name: 'posture', title: 'Осанка', desc: 'Осанка'},

    // Уникальные физические черты
    {name: 'scarsInjuries', title: 'Шрамы и травмы', desc: 'Шрамы и травмы'},
    {name: 'tattoos', title: 'Татуирвоки', desc: 'Татуирвоки'},
    {name: 'peculiarities', title: 'Внешние особенности', desc: 'Близко посаженные глаза, выдющийся подбородок и т.д.'},

    // Динамические характеристики
    {name: 'timbreVoice', title: 'Тембр голоса', desc: 'Тембр голоса'},
    {name: 'speakingRate', title: 'Скорость речи', desc: 'Скорость речи'},

    // Стиль и визуальные особенности
    {name: 'clothingStyle', title: 'Стиль одежды', desc: 'Стиль одежды'},
    {name: 'clothingCondition', title: 'Состояние одежды', desc: 'Состояние одежды'},
    {name: 'clothingItems', title: 'Предметы одежды', desc: 'Предметы одежды'},
    {name: 'clothingAccessories', title: 'Аксессуары', desc: 'Аксессуары'},

    {name: 'have', title: 'Предметы при себе', desc: 'Предметы при себе'},
    {name: 'notes', title: 'Текущие заметки', desc: 'Текущие заметки'},
]
export const arrMapOfScene: IMapProp[] = [
    {
        name: 'location',
        title: 'Место действия',
        desc: '— Географическое расположение (город, джунгли).\n— Сооружение (дом, помещение).\n— Место.'
    },
    {
        name: 'detailsEnv',
        title: 'Детали окружения',
        desc: '— Интерьер (мебель, декор, предметы).\n— Природа (деревья, река, животные).\n— Климатические условия (дождь, жара, туман).\n— Освещение (сумерки, яркий свет, свечи).\n— Социальная обстановка (богатый квартал, трущобы, замок).'
    },
    {
        name: 'time',
        title: 'Время действия',
        desc: '— Хронологический период (историческая эпоха, современность).\n— Время года, суток (зима, ночь, рассвет).\n— Сезонные особенности (лето, зима).'
    },
    {
        name: 'mood',
        title: 'Настроение, тон',
        desc: '— Эмоциональная окраска (радость, таинственность, тревожность).\n— Использование метафор, сравнений для создания образов.'
    },
    {
        name: 'sensors',
        title: 'Сенсорные детали',
        desc: '— Зрительные образы (цвета, формы, движения).\n— Звуки (шум ветра, тишина, музыка).\n— Запахи, тактильные ощущения (аромат цветов, холод).'
    },
    {
        name: 'symbols',
        title: 'Символизм и подтекст',
        desc: '— Символические элементы несущие скрытый смысл (разбитое зеркало, часы, старый портрет, гроза как символ кризиса).\n— Аллегории, намёки на темы произведения.'
    }
]


export const getObjectMap = (arrMap: IMapProp[]): { [key: string]: string } | any => {
    const resultObj = {id: generateUID()};
    for (let i = 0; i < arrMap.length; i++) {
        const {desc, name} = arrMap[i];
        resultObj[name] = '';
    }

    return resultObj;
}
export const getArrMap = (arrMap: IMapProp[]): { [key: string]: string } | any => {
    const resultObj = {id: generateUID()};
    for (let i = 0; i < arrMap.length; i++) {
        const {desc, name} = arrMap[i];
        resultObj[name] = '';
    }

    return resultObj;
}

export default {arrMapOfScene, arrMapOfCharacter, arrMapOfItem};
