/**
 * Заполнить ячейки данными (по шаблону строки)
 * @param arrData
 * @param templateRow
 * @param colIndex
 */
function fillDataToRowsByTemplate(arrData: any[], templateRow: TRow, colIndex: number): TRow[] {
    const arrRes = [];
    const len = arrData.length;
    for (let i = 0; i < len; i++) {
        let row = structuredClone(templateRow)
        let it = row.cells;
        const lenCol = arrData[i].length
        for (let j = 0; j < lenCol; j++) {
            if (it[j + colIndex]?.text) //если есть текст заполняем как текст
                it[j + colIndex].text = arrData[i][j];
            else
                it[j + colIndex] = {text: arrData[i][j]};
        }
        arrRes.push(row);
    }

    return arrRes;
}

/**
 * Получить команду и имя индекс колонки
 * @param row
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
 * @param arrSheet
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
 * @param arrSheet
 * @param callbackData
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
    }
    return arr;
};

export default fillData;