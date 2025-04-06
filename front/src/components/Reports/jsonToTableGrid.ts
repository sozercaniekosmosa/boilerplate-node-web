import {getHashCyrb53} from "../../lib/utils.ts";

/**
 * обнаруживает пропуски в нумерации строк объекта sheetData.rows и заполняет их пустыми объектами, сохраняя последовательность индексов
 * @paramVal arrSheet
 */
// @ts-ignore
function fillRowGaps(arrSheet: TArraySheet) {
    let rowNum = 1;
    for (const idx of Object.keys(arrSheet.rows || {})) {
        const current = parseInt(idx) + 1;
        for (let j = rowNum + 1; j < current; j++) arrSheet.rows[j] = {};
        rowNum = current;
    }
}

function getMaxLenOfCols(arr) {
    let maxLength = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i]?.cells) {
            let _arr = Object.values(arr[i].cells);
            // @ts-ignore
            const len = _arr.filter(it => !!it?.text).length
            maxLength = Math.max(maxLength, len);
        }
    }

    return maxLength;
}

export function jsonToHtmlTableGrid(json: any): string {

    fillRowGaps(json);

    const {rows, cols, merges, styles} = json;
    const listStyle = {};
    // Определяем количество строк и столбцов
    const rowCount = Object.keys(rows).filter(k => !isNaN(Number(k))).length;
    // const colCount = cols.len || Object.keys(cols).filter(k => !isNaN(Number(k))).length;
    const colCount = getMaxLenOfCols(Object.values(rows));

    // Матрица для отслеживания объединённых ячеек
    const mergedCells: boolean[][] = Array.from({length: rowCount}, () =>
        Array(colCount).fill(false)
    );
    const mergeMap: Record<string, { rowspan: number, colspan: number }> = {};

    // Обработка объединений из массива merges
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
            num = num * 26 + (label.charCodeAt(i) - 64);
        }
        return num - 1;
    }

    // Генерация HTML с использованием div-ов
    let html = '';

    // Определение ширины колонок
    const colWidths = [];
    for (let colIndex = 0; colIndex < colCount; colIndex++) {
        const col = cols[colIndex];
        const width = col?.width ? `${col.width * 7}px` : 'auto';
        colWidths.push(width);
    }

    // Определение высот строк
    const rowHeights = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const row = rows[rowIndex];
        const height = row?.height ? `${row.height}px` : 'auto';
        rowHeights.push(height);
    }

    // Создание контейнера grid
    html += `<div class="grid-container" style="display: grid; grid-template-columns: ${colWidths.join(' ')}; grid-template-rows: ${rowHeights.join(' ')}; border-collapse: collapse;">`;

    // Сбор всех ячеек для отображения
    let cellsToRender = [];

    // Добавляем ячейки из mergeMap
    Object.entries(mergeMap).forEach(([cellKey, mergeInfo]) => {
        const [row, col] = cellKey.split(',').map(Number);
        const cell = rows[row]?.cells?.[col];
        if (cell) {
            cellsToRender.push({
                row,
                col,
                rowspan: mergeInfo.rowspan,
                colspan: mergeInfo.colspan,
                cell
            });
        }
    });

    // Добавляем обычные ячейки и пустые
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        for (let colIndex = 0; colIndex < colCount; colIndex++) {
            if (!mergedCells[rowIndex]?.[colIndex]) {
                const cellKey = `${rowIndex},${colIndex}`;
                if (!mergeMap[cellKey]) {
                    const cell = rows[rowIndex]?.cells?.[colIndex];
                    cellsToRender.push({
                        row: rowIndex,
                        col: colIndex,
                        rowspan: 1,
                        colspan: 1,
                        cell: cell || {text: ''}
                    });
                }
            }
        }
    }

    cellsToRender = cellsToRender.sort((a, b) => a.row - b.row);

    // Генерация ячеек
    cellsToRender.forEach(({row, col, rowspan, colspan, cell}, i) => {
        const styleCell = styles[cell.style] || {};
        const gridRow = `${row + 1} / ${row + 1 + rowspan}`;
        const gridColumn = `${col + 1} / ${col + 1 + colspan}`;
        const style = getStyle(styleCell)
        listStyle[style.className] = style.css;
        html += `<div class="${"cell " + style.className}" style="grid-row: ${gridRow}; grid-column: ${gridColumn}; ">${cell.text || '&nbsp;'}</div>`;
    });

    html = '<style>' + Object.entries(listStyle).map(([className, css]) => `.${className}{${css}}`).join('\r\n') + '</style>' + html;

    html += '</div>';
    return html;
}

// Преобразование стилей в CSS
function getStyle(style: any): { className: string, css: string } {
    const css: string[] = [];

    if (style.align) css.push(`text-align: ${style.align};`);
    if (style.valign) {
        const valign = style.valign == 'middle' ? 'center' : style.valign == 'top' ? 'start' : style.valign == 'bottom' ? 'end' : style.valign;
        css.push(`align-content: ${valign};`);
    }
    if (style.border) {
        // @ts-ignore
        Object.entries(style.border).forEach(([side, [width, color]]: [string, string]) => {
            css.push(`border-${side}: ${width} solid ${color};`);
        });
        css.push(`margin: 0 -1px -1px 0;`);
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