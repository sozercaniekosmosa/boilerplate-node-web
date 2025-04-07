function columnToLetter(column: number): string {
    let temp;
    let letter = '';
    let col = column;
    while (col >= 0) {
        temp = col % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = Math.floor(col / 26) - 1;
    }
    return letter;
}

function getMergeRange(r: number, c: number, merge: [number, number]): string {
    const rowSpan = merge[0] + 1;
    const colSpan = merge[1] + 1;
    const startRow = r + 1;
    const startCol = columnToLetter(c);
    const endRow = r + rowSpan;
    const endCol = columnToLetter(c + colSpan - 1);
    return `${startCol}${startRow}:${endCol}${endRow}`;
}

function addMissingMerges(sheet: any): void {
    const existingMerges = new Set(sheet.merges);

    for (const rowKey in sheet.rows) {
        if (sheet.rows.hasOwnProperty(rowKey)) {
            const rowIndex = parseInt(rowKey, 10);
            const row = sheet.rows[rowKey];

            for (const cellKey in row.cells) {
                if (row.cells.hasOwnProperty(cellKey)) {
                    const colIndex = parseInt(cellKey, 10);
                    const cell = row.cells[cellKey];

                    if (cell && cell.merge) {
                        const [rowMerge, colMerge] = cell.merge;
                        const mergeRange = getMergeRange(rowIndex, colIndex, [rowMerge, colMerge]);

                        // Skip single-cell ranges
                        const [start, end] = mergeRange.split(':');
                        if (start === end) {
                            continue;
                        }

                        if (!existingMerges.has(mergeRange)) {
                            existingMerges.add(mergeRange);
                        }
                    }
                }
            }
        }
    }

    sheet.merges = Array.from(existingMerges);
}


/**
 * Если строка [undefined, null, NaN] тогда возвращаем пустую строку ""
 * @param value
 */
const sanitizeValue = (value: any) => value === undefined || value === null || Number.isNaN(value) ? "" : value;

/**
 * Заполнить ячейки данными (по шаблону строки)
 * @paramVal arrData
 * @paramVal templateRow
 * @paramVal colXOff
 */
function fillDataToRowsByTemplate(arrData: any[], templateRow: TRow, colXOff: number): TRow[] {
    // console.log(arrData)

    let arr: any[];
    if (Array.isArray(arrData)) {
        arr = Array.isArray(arrData[0]) ? arrData : [arrData];
    } else {
        arr = [[arrData]];
    }

    const arrRes = [];
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        let row = structuredClone(templateRow)
        let it = row.cells;
        const lenCol = arr[i].length
        for (let j = 0, colX = 0; j < lenCol; j++, colX++) {
            let off = colX + colXOff;
            if (it[off]?.text) //если есть текст заполняем как текст
                it[off].text = sanitizeValue(arr[i][j]);
            else
                it[off] = {text: arr[i][j]};

            if (it[off]?.merge) { //если есть merge-пропускаем не функциональные
                colX += it[off].merge[1];
            }
        }
        arrRes.push(row);
    }

    return arrRes;
}

/**
 * Получить команду и имя индекс колонки
 * @paramVal row
 * @return [command, name, colIndex]
 */
function getCommand(row: TRow): [string, string, number | null] {
    const arrCol = Object.entries(row.cells || {});
    for (let celX = 0; celX < arrCol.length; celX++) { // перебираем ячейки внутри строки

        const [colIndex, cellData]: [string, TCellData] = arrCol[celX];
        const cmdName = cellData.text;

        if (typeof cmdName == 'string' && cmdName.includes('#')) {
            const [cmd, name] = cmdName.split('#');
            return [cmd, name, +colIndex]
        }
    }
    return ['', '', null];
}

/**
 * обнаруживает пропуски в нумерации строк объекта sheetData.rows и заполняет их пустыми объектами, сохраняя последовательность индексов
 * @paramVal arrSheet
 */
function fillRowGaps(arrSheet: TArraySheet) {
    for (const item of arrSheet) {
        let rowNum = 1;
        for (const idx of Object.keys(item.rows || {})) {
            const current = parseInt(idx) + 1;
            for (let j = rowNum + 1; j < current; j++) item.rows[j] = {};
            rowNum = current;
        }
    }
}

/**
 * Залить данные в документ
 * @paramVal arrSheet
 * @paramVal callbackData
 */
const fillData = async (arrSheet: TArraySheet, callbackData: (cmd: string, name: string) => Promise<any[]>) => {

    let arr = structuredClone(arrSheet)

    fillRowGaps(arr);

    for (let i = 0; i < arr.length; i++) { // перебираем все листы

        let resultArrRow: TRow[] = [];
        let arrRow = Object.entries(arr[i].rows || {});
        for (let rowY = 0; rowY < arrRow.length; rowY++) { // перебираем все строки

            const [rowIndex, row]: [string, TRow] = arrRow[rowY];
            const [cmd, name, colIndex] = getCommand(row);

            if (name) {
                let arrData = await callbackData(cmd, name);
                let arrRow: TRow[] = fillDataToRowsByTemplate(arrData, row, +colIndex);
                resultArrRow.push(...arrRow);
            } else {
                resultArrRow.push(row);
            }
        }

        for (let rowY = 0; rowY < resultArrRow.length; rowY++) {
            arr[i].rows[rowY] = resultArrRow[rowY];
        }

        arr[0].rows.len = resultArrRow.length;

        addMissingMerges(arr[i]); // Добавить недостающие объединения для вновь добавленных данных
    }
    return arr;
};

export default fillData;