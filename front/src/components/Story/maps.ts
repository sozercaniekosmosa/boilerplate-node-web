import {IMap} from "./types";
import {generateUID, getID} from "../../lib/utils.ts";

export const arrMapOfItem: IMap[] = [
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
export const arrMapOfCharacter: IMap[] = [
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
export const arrMapOfScene: IMap[] = [
    {name: 'name', desc: 'Название сцены'},
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


export const getObjectMap = (arrMap: IMap[]): { [key: string]: string } | any => {
    const resultObj = {id: generateUID()};
    for (let i = 0; i < arrMap.length; i++) {
        const {desc, name} = arrMap[i];
        resultObj[name] = '';
    }

    return resultObj;
}

export default {arrMapOfScene, arrMapOfCharacter, arrMapOfItem};
