import {generateUID} from "./utils.ts";

export const createTable = (cols: number, rows: number, clb: (obj: {}) => void, classTable: string) => {
    // Создаем div для таблицы
    let table = document.createElement('div');
    classTable && table.classList.add(classTable)
    table.style.display = 'table';

    for (var i = 0; i < rows; i++) {
        // Создаем div для строки
        var row = document.createElement('div');
        row.style.display = 'table-row';

        for (var j = 0; j < cols; j++) {
            var cell = document.createElement('div');
            cell.style.display = 'table-cell';
            clb({table, row, cell, x: i, y: j, index: i * cols + j});

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table;
}

const getHtmlStr = (html: string) => {
    const template = document.createElement('template'), content = template.content;
    template.innerHTML = html.trim(); // Never return a text node of whitespace as the result;
    return content.childNodes.length ? content.childNodes : [content.firstChild];
};

export const setStyle = (strStyle, cssObjectID = generateUID('st')) => {
    let destNode = document.head;
    let node = destNode.querySelector('.' + cssObjectID);
    strStyle = strStyle.replaceAll(/[\r\n]| {2}/g, '')
    if (!node)
        destNode.append(getHtmlStr(`<style class='${cssObjectID}'>${strStyle}</style>`)[0]);
    else
        node.innerHTML = strStyle;

    return node;
}