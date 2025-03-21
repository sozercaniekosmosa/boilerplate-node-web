export default {
    toolbar: {
        undo: 'Отменить',
        redo: 'Повторить',
        print: 'Печать',
        paintformat: 'Копировать формат',
        clearformat: 'Очистить формат',
        format: 'Формат',
        fontName: 'Шрифт',
        fontSize: 'Размер шрифта',
        fontBold: 'Полужирный',
        fontItalic: 'Курсив',
        underline: 'Подчеркивание',
        strike: 'Зачеркивание',
        color: 'Цвет текста',
        bgcolor: 'Цвет заливки',
        border: 'Границы',
        merge: 'Объединить ячейки',
        align: 'Горизонтальное выравнивание',
        valign: 'Вертикальное выравнивание',
        textwrap: 'Перенос текста',
        freeze: 'Заморозить ячейку',
        autofilter: 'Фильтр',
        formula: 'Функции',
        more: 'Еще',
    },
    contextmenu: {
        copy: 'Копировать',
        cut: 'Вырезать',
        paste: 'Вставить',
        pasteValue: 'Вставить только значения',
        pasteFormat: 'Вставить только формат',
        hide: 'Скрыть',
        insertRow: 'Вставить строку',
        insertColumn: 'Вставить столбец',
        deleteSheet: 'Удалить',
        deleteRow: 'Удалить строку',
        deleteColumn: 'Удалить столбец',
        deleteCell: 'Удалить ячейку',
        deleteCellText: 'Удалить текст ячейки',
        validation: 'Проверка данных',
        cellprintable: 'Включить экспорт',
        cellnonprintable: 'Отключить экспорт',
        celleditable: 'Включить редактирование',
        cellnoneditable: 'Отключить редактирование',
    },
    print: {
        size: 'Размер бумаги',
        orientation: 'Ориентация страницы',
        orientations: ['Альбомная', 'Книжная'],
    },
    format: {
        normal: 'Обычный',
        text: 'Обычный текст',
        number: 'Число',
        percent: 'Процент',
        rmb: 'Юань',
        usd: 'Доллар США',
        eur: 'Евро',
        date: 'Дата',
        time: 'Время',
        datetime: 'Дата и время',
        duration: 'Продолжительность',
    },
    formula: {
        sum: 'Сумма',
        average: 'Среднее',
        max: 'Максимум',
        min: 'Минимум',
        _if: 'ЕСЛИ',
        and: 'И',
        or: 'ИЛИ',
        concat: 'Объединить',
    },
    validation: {
        required: 'обязательно для заполнения',
        notMatch: 'не соответствует правилу проверки',
        between: 'между {} и {}',
        notBetween: 'не между {} и {}',
        notIn: 'не в списке',
        equal: 'равно {}',
        notEqual: 'не равно {}',
        lessThan: 'меньше {}',
        lessThanEqual: 'меньше или равно {}',
        greaterThan: 'больше {}',
        greaterThanEqual: 'больше или равно {}',
    },
    error: {
        pasteForMergedCell: 'Невозможно выполнить для объединенных ячеек',
    },
    calendar: {
        weeks: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    },
    button: {
        next: 'Далее',
        cancel: 'Отмена',
        remove: 'Удалить',
        save: 'Сохранить',
        ok: 'ОК',
    },
    sort: {
        desc: 'Сортировка Z -> A',
        asc: 'Сортировка A -> Z',
    },
    filter: {
        empty: 'пусто',
    },
    dataValidation: {
        mode: 'Режим',
        range: 'Диапазон ячеек',
        criteria: 'Критерии',
        modeType: {
            cell: 'Ячейка',
            column: 'Столбец',
            row: 'Строка',
        },
        type: {
            list: 'Список',
            number: 'Число',
            date: 'Дата',
            phone: 'Телефон',
            email: 'Email',
        },
        operator: {
            be: 'между',
            nbe: 'не между',
            lt: 'меньше',
            lte: 'меньше или равно',
            gt: 'больше',
            gte: 'больше или равно',
            eq: 'равно',
            neq: 'не равно',
        },
    },
};
