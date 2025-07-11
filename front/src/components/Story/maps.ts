// @ts-ignore
import {IMapProp} from "./types.ts";

export const arrMapOfItem: IMapProp[] = [
    {section: true, title: 'Основные'},
    {title: 'Название', desc: 'Другие названия/имена'},
    {title: 'Категория', desc: 'Категория объекта: мебель, макгаффин, фоновый элемент, артефакт, символ'},
    {ext: true, title: 'Влияние', desc: 'Уровень влияния на сюжет: не влияет, средне, сильное'},

    {section: true, title: 'Сенсорная интеграция'},
    {title: 'Визульно', desc: 'Визульные ощущения: Позолота, стирающаяся на изгибах'},
    {ext: true, title: 'Тактильно', desc: 'Тактильные ощущения: Холодный металл с шершавыми гранями'},
    {ext: true, title: 'Аудиально', desc: 'Аудиальные ощущения: Глухой стук при падении'},

    {section: true, title: 'Физические характеристики'},
    {title: 'Вес', desc: 'Вес: тяжелый, несколько киллограмм, как пушинка'},
    {title: 'Размеры', desc: 'Длина, ширина, высота, огромный, меньше горошины'},
    {ext: true, title: 'Матриал', desc: 'Из чего сделан предмет: дерево, металл, пластик'},
    {ext: true, title: 'Температура', desc: 'Температура: теплый, ледяной, кипяток'},
    {ext: true, title: 'Форма', desc: 'Например: продолговатый цилиндр со скругленными\nгранями. форма, геометрическая конфигурация'},

    {section: true, title: 'Дополнительные'},
]
export const arrMapOfCharacter: IMapProp[] = [

    {section: true, title: 'Основные'},

    {title: 'Имя', desc: '<Фамилия> <Имя> <Отчество>, <2–3 уменьшительно‑ласкательных варианта>, по прозвищу <Короткое прозвище>'},
    {title: 'Возраст', desc: 'Средний, пожилой, молодой, 35 лет, юноша, и т.п.'},
    {title: 'Цели', desc: '<Цели>, <Мотвация>'},
    {title: 'Жизненная ситуация', desc: 'Социальный статус, проблемы'},
    {title: 'Имеет при себе', desc: 'Уже имеет или получил: предметы, умения, информация'},

    {ext: true, title: 'Прошлое', desc: 'История жизни в прошлом'},
    {ext: true, title: 'Отношения', desc: 'Отношения: друзья, семья, знакомые, коллеги'},
    {ext: true, title: 'Интеллект и творчество', desc: 'Интеллектуальные и творческие способности'},

    {ext: true, title: 'Скрытые цели', desc: 'Скрытые цели и мотвация'},
    {ext: true, title: 'Мораль', desc: 'Моральные/аморальные  аспекты личности'},

    {section: true, title: 'Тело/физические характеристики'},

    {title: 'Пол', desc: 'Пол'},
    {title: 'Рост', desc: 'Рост персонажа (сантиметры, высокий, низкий, и т.д. )'},
    {title: 'Телосложение', desc: 'Телосложение'},
    {title: 'Цвет волос', desc: 'Цвет волос'},
    {title: 'Цвет глаз', desc: 'Цвет глаз'},
    {ext: true, title: 'Стрижка/причёска', desc: 'Причёска/стрижка'},
    {ext: true, title: 'Длина волос', desc: 'Длина волос'},
    {ext: true, title: 'Физические особенности', desc: 'Близко посаженные глаза, выдющийся подбородок и т.д.'},
    {ext: true, title: 'Осанка', desc: 'Осанка'},
    {ext: true, title: 'Шрамы и травмы', desc: 'Шрамы и травмы'},
    {ext: true, title: 'Татуирвоки', desc: 'Татуирвоки'},
    {ext: true, title: 'Тембр голоса', desc: 'Тембр голоса'},
    {ext: true, title: 'Скорость речи', desc: 'Скорость речи'},

    {section: true, title: 'Стиль и визуальные особенности'},

    {title: 'Одежда', desc: 'Предметы одежды: штаны, рубашка'},
    {ext: true, title: 'Состояние одежды', desc: 'Состояние одежды'},
    {ext: true, title: 'Стиль одежды', desc: 'Стиль одежды'},
    {ext: true, title: 'Аксессуары', desc: 'Аксессуары'},

    {section: true, title: 'Эмоциональные и психические аспекты'},

    {title: 'Привычки', desc: 'Привычки, типичные жесты, и т.д.'},
    {
        // title: 'Характер', list: ['Сангвиник', 'Холерик', 'Флегматик', 'Меланхолик'],
        title: 'Характер',
        desc: 'Тип темперамента:\n' +
            '— Энергичный, общительный, оптимистичный, быстро реагирует на события, легко переключается между делами, но может быть легкомысленным.\n' +
            '— Целеустремлённый, импульсивный, вспыльчивый, быстро возбуждается, склонен к лидерству, но иногда не сдержан.\n' +
            '— Спокойный, уравновешенный, медлительный, надёжен, устойчив к стрессам, но может быть инертным и сухим в общении.\n' +
            '— Чувствительный, ранимый, склонен к переживаниям, замкнут, часто тревожен и пессимистичен.',
    },
    {ext: true, title: 'Склонность к сарказму', desc: 'Склонность к сарказму'},
    {ext: true, title: 'Эмпатия', desc: 'Способность к сопереживанию (0-10)', range: [0, 10]},
    {ext: true, title: 'Фобии', desc: 'Список страхов'},
    {
        ext: true,
        title: 'Харизма влияние на других (0-10)',
        desc: 'Влияние на других, способность мобилизовать и вести за собой',
        range: [0, 10]
    },
    {section: true, title: 'Дополнительные'},
]
export const arrMapOfScene: IMapProp[] = [
    {section: true, title: 'Основные', disabledExt: true},
    {
        title: 'Место действия',
        desc: 'Географическое расположение (город, джунгли),\n сооружение (дом, помещение) или\n просто место.'
    },
    {
        title: 'Детали окружения',
        desc: 'Интерьер (мебель, декор, предметы),\n природа (деревья, река, животные),\n климатические условия (дождь, жара, туман),\n освещение (сумерки, яркий свет, свечи),\n социальная обстановка (богатый квартал, трущобы, замок).'
    },
    {
        title: 'Время действия',
        desc: 'Хронологический период (историческая эпоха, современность),\n время года, суток (зима, ночь, рассвет),\n сезонные особенности (лето, зима).'
    },
    {section: true, title: 'Расширенные', disabledExt: true},
    {
        title: 'Настроение, тон',
        desc: 'Эмоциональная окраска (радость, таинственность, тревожность),\n использование метафор, сравнений для создания образов.'
    },
    {
        title: 'Сенсорные детали',
        desc: 'Зрительные образы (цвета, формы, движения),\n звуки (шум ветра, тишина, музыка),\n запахи, тактильные ощущения (аромат цветов, холод).'
    },
    {
        title: 'Символизм и подтекст',
        desc: 'Символические элементы несущие скрытый смысл (разбитое зеркало, часы, старый портрет, гроза как символ кризиса),\n аллегории, намёки на темы произведения.'
    },
    {section: true, title: 'Дополнительные'},
]

export default {arrMapOfScene, arrMapOfCharacter, arrMapOfItem};
