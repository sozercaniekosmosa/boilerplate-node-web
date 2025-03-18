function transformDataToRow(arrData: any[], templateRow: TCells, colIndex: number): TCells[] {
    const arrRes = [];
    const len = arrData.length;
    for (let i = 0; i < len; i++) {
        let it = structuredClone(templateRow)
        const lenCol = arrData[i].length
        for (let j = 0; j < lenCol; j++) {
            it[j + colIndex].text = arrData[i][j];
        }
        arrRes.push(it);
    }

    return arrRes;
}

function getCommand(arrRow: TRow): [string, string, number | null] {
    const arrCol = Object.entries(arrRow.cells || {});
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

export const fillDataToSheet = async (sheetData: TSheetData, callbackData: (cmd: string, name: string) => Promise<any[]>) => {

    let sd = structuredClone(sheetData)

    let resultArrRow: Record<string, TCellData>[] = [];

    let sheetDataArrRow = Object.entries(sd.rows || {});
    for (let rowY = 0; rowY < sheetDataArrRow.length; rowY++) { // перебираем все строки

        const [rowIndex, row]: [string, TRow] = sheetDataArrRow[rowY];
        const [cmd, name, colIndex] = getCommand(row);

        if (name) {
            let arrData = await callbackData(cmd, name);
            let arrRow: TCells[] = transformDataToRow(arrData, row.cells, +colIndex);
            resultArrRow.push(...arrRow);
        } else {
            resultArrRow.push(row.cells);
        }
    }

    for (let i = 0; i < resultArrRow.length; i++) {
        sd.rows[i] = {cells: resultArrRow[i]};
    }

    return sd;
};