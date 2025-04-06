import {getHashCyrb53} from "../../lib/utils.ts";

function mergeHandler(merges: any[], mergeMap: {}, mergedCells: boolean[][]) {
    merges.forEach((merge: string) => {
        const [startCell, endCell] = merge.split(":");
        const [startCol, startRow] = parseCellAddress(startCell);
        const [endCol, endRow] = parseCellAddress(endCell);

        const rowspan = endRow - startRow + 1;
        const colspan = endCol - startCol + 1;

        // Сохраняем информацию о начальной ячейке
        const cellKey = `${startRow},${startCol}`;
        mergeMap[cellKey] = {rowspan, colspan};

        // Помечаем все ячейки в диапазоне как объединённые
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                if (row === startRow && col === startCol) continue; // Пропускаем начальную
                if (!mergedCells[row]) mergedCells[row] = [];
                mergedCells[row][col] = true;
            }
        }
    });
}

// Парсинг адреса ячейки
function parseCellAddress(address: string): [number, number] {
    const match = address.match(/([A-Z]+)(\d+)/);
    if (!match) throw new Error(`Invalid cell address: ${address}`);
    const col = columnLabelToNumber(match[1]);
    const row = parseInt(match[2], 10) - 1;
    return [col, row];
}

// Преобразование буквы столбца в число
function columnLabelToNumber(label: string): number {
    let num = 0;
    for (let i = 0; i < label.length; i++) {
        num = num * 26 + (label.charCodeAt(i) - 64); // 'A' -> 1
    }
    return num - 1; // Индекс начинается с 0
}

function getGroupCols(cols, colCount: number) {
    let html: string = ''

    for (let colIndex = 0; colIndex < colCount; colIndex++) {
        const width = cols[colIndex]?.width ? `width: ${cols[colIndex]?.width}px;` : '';
        html += `<col style="${width}">`
    }

    return `<colgroup>${html}</colgroup>`
}

function getCol(rowIndex: number, colIndex: number, mergeMap: {}, cells: {}, styles, listStyle: {}) {
    let html: string = ''

    const cellKey = `${rowIndex},${colIndex}`;
    const mergeInfo = mergeMap[cellKey];
    const cell = cells[colIndex] || {};
    const styleCell = styles[cell.style/* || 0*/] || {};
    const style = getStyle(styleCell)
    listStyle[style.className] = style.css;

    if (mergeInfo) {
        const {rowspan, colspan} = mergeInfo;

        html += `<td class="${"cell " + style.className}" rowspan="${rowspan}" colspan="${colspan}">${cell.text || ''}</td>`;
    } else {
        html += cell ? `<td class="${"cell " + style.className}">${cell.text || ''}</td>` : '<td></td>';
    }
    return html;
}

function getRow(rows, rowIndex: number, colCount: number, mergedCells: boolean[][], mergeMap: {}, styles, listStyle: {}) {
    let html: string = ''

    const row = rows[rowIndex] || {};
    const cells = row.cells || {};
    html += `<tr style="height: ${row.height || 15}px;">`;

    for (let colIndex = 0; colIndex < colCount; colIndex++) {
        if (mergedCells[rowIndex]?.[colIndex]) continue; // Пропускаем объединённые ячейки
        html += getCol(rowIndex, colIndex, mergeMap, cells, styles, listStyle);
    }

    html += '</tr>';
    return html;
}

function getStyles(listStyle: {}) {
    //language=css
    let cssTable: string = `
        .table-report {
            border-collapse: collapse;
            width: 100%;
        }
    `;
    const arrTableCssRows = Object.entries(listStyle).map(([className, css]) => `.${className}{${css}}`);
    return `<style>${cssTable}${arrTableCssRows.join('\r\n')}</style>`;
}

export function jsonToHtmlTable(json: any): string {
    const {rows, cols, merges, styles, properties} = json;

    // Определяем количество строк и столбцов
    const rowCount = rows.len || Object.keys(rows).filter(k => !isNaN(Number(k))).length;
    const colCount = cols.len || Object.keys(cols).filter(k => !isNaN(Number(k))).length;

    const arrTitleHeaderRow = [];
    const arrPinHeaderRow = [];
    const listStyle = {}; // Определяем список стилей

    // Матрица для отслеживания объединённых ячеек
    const mergedCells: boolean[][] = Array.from({length: rowCount}, () => Array(colCount).fill(false));
    let mergeMap = {};

    // Обработка объединений из массива merges
    mergeHandler(merges, mergeMap, mergedCells);

    // Генерация HTML-таблицы
    const groupCols = getGroupCols(cols, colCount);
    const arrRow = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const row = getRow(rows, rowIndex, colCount, mergedCells, mergeMap, styles, listStyle);

        if (properties?.pinHeader) { // Если есть фиксация заголовка разделяем данные
            const [fromRow, toRow] = properties.pinHeader;
            if (rowIndex < fromRow) {
                arrTitleHeaderRow.push(row); // Заполняем Title для первой страницы
            } else if (fromRow <= rowIndex && rowIndex <= toRow) {
                arrPinHeaderRow.push(row); // Заполняем заголовок для повторения на каждой странцие
            } else {
                arrRow.push(row); // Все остальное
            }
        } else {  // Не заголовков и фиксации
            arrRow.push(row);
        }
    }

    const styleAll = getStyles(listStyle);

    //language=html
    // Если есть фиксация заголовка разделяем данные
    const htmlTitle = properties?.pinHeader && arrTitleHeaderRow.length ? `
        <table class="table-report">
            ${groupCols}
            <tbody>${arrTitleHeaderRow.join('')}</tbody>
        </table>` : '';

    //language=html
    return `
        ${styleAll}
        ${htmlTitle}
        <table class="table-report">
            ${groupCols}
            <thead>${arrPinHeaderRow.join('')}</thead>
            <tbody>${arrRow.join('')}</tbody>
        </table>`;
}

// Преобразование стилей в CSS
function getStyle(style: any): { className: string, css: string } {
    const css: string[] = [];

    if (style.align) css.push(`text-align: ${style.align};`);
    if (style.valign) css.push(`vertical-align: ${style.valign};`);
    if (style.border) {
        // @ts-ignore
        Object.entries(style.border).forEach(([side, [width, color]]) => {
            css.push(`border-${side}: ${width} solid ${color};`);
        });
    }
    if (!style.textwrap) {
        css.push('white-space: nowrap; overflow: hidden;');
    }
    if (style.font) {
        const fontParts = [];
        if (style.font.bold) fontParts.push('bold');
        if (style.font.italic) fontParts.push('italic');
        fontParts.push(`${style.font.size}pt`);
        fontParts.push(style.font.name);
        css.push(`font: ${fontParts.join(' ')};`);
        if (style.font.color) css.push(`color: ${'#' + style.font.color.slice(2)};`);
    }
    if (style.fill?.bgColor) css.push(`background-color: ${'#' + style.fill.bgColor.slice(2)};`);

    let strCSS = css.join(' ');
    return {className: 's' + getHashCyrb53(strCSS), css: strCSS}
}