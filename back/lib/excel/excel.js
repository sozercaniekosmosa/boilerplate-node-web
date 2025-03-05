import Excel from "exceljs";

// console.log(process.cwd())

function duplicateRows(ws, offRowY, quan) {

}

function getListMerges(ws) {
    const listMerges = {};

    const merges = Object.entries(ws._merges).map(([addr, {top, bottom, left, right}]) => ({
        addr, top, bottom, left, right
    }));

    for (let i = 0; i < merges.length; i++) {
        const {addr, top, bottom, left, right} = merges[i];
        const cell = ws.getCell(addr);
        const key = `${top}.${left}`;
        listMerges[key] = {addr, x: left, y: top, h: bottom - top, w: right - left, left, right}
        cell.value = (cell.value ?? '') + '|' + key;

        ws.unMergeCells(addr);

        for (let rowY = top; rowY <= bottom; rowY++) {
            for (let colX = left; colX <= right; colX++) {
                const c = ws.getCell(rowY, colX);
                if (c.value === null) c.value = '*'
            }
        }
    }
    return listMerges;
}

function mergeApply(ws, rowYLen, colXLen, listMerges) {
    for (let rowY = 1; rowY <= rowYLen; rowY++) {
        for (let colX = 1; colX <= colXLen; colX++) {
            const cell = ws.getCell(rowY, colX);
            const [val, key] = (cell.value + '')?.split('|')
            if (key && !cell.isMerged) {
                cell.value = val ?? '';
                const {h, w} = listMerges[key];
                let dim = [rowY, colX, rowY + h, colX + w];
                ws.mergeCells(...dim);
            }
        }
    }
}

function fillValue(ws, arr, offRowY, offColX) {
    ws.duplicateRow(offRowY, arr.length - 1, true)
    const getCellMaster = (rowY, offColX) => {
        let arrCell = [];
        for (let colX = offColX; colX <= ws.lastColumn.number; colX++) {
            const cell = ws.getCell(rowY, colX)
            // if (!cell.model?.master) arrCell.push(cell)
            if (cell.value !== '*') arrCell.push(cell)
        }
        return arrCell;
    }

    for (let i = 0; i < arr.length; i++) {
        let rowY = i + offRowY;
        const arrLine = arr[i];
        const arrCell = getCellMaster(rowY, offColX)
        if (arrLine.length > arrCell.length) throw 'Разная ширина данных и таблицы'
        for (let j = 0; j < arrLine.length; j++) {
            const cell = arrCell[j];
            const value = arrLine[j];
            const [val, key] = (cell.value + '')?.split('|')
            cell.value = key && !cell.isMerged ? value + '|' + key : value;
        }
    }
}

export const createExcelReport = async (data) => {

    const arrKeys = Object.keys(data);
    console.log(arrKeys)
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('template.xlsx');

    let ws = workbook.getWorksheet(1);
    let rowYLen = ws.lastRow.number;
    const colXLen = ws.lastColumn.number;

    const listMerges = getListMerges(ws);

    for (let rowY = 1; rowY <= rowYLen; rowY++) {
        for (let colX = 1; colX <= colXLen; colX++) {
            const cell = ws.getCell(rowY, colX);
            // for (let i = 0; i < arrKeys.length; i++) {
            //     const key = arrKeys[i];
            // if (cell.value?.includes && cell.value?.includes(key)) {
            // if (/#[a-zA-Z][a-zA-Z0-9_]*#/.test(cell.value)) {
            if (typeof cell.value === 'string' && cell.value?.startsWith('##')) {
                const key = cell.value.substring(2);
                if (Array.isArray(data[key])) {
                    fillValue(ws, data[key], rowY, colX);
                    rowYLen = ws.lastRow.number;
                    rowY += Array.isArray(data[key]) ? data[key].length : 0;
                } else {
                    cell.value = data[key]
                }
            }

            // }
        }
    }

    mergeApply(ws, ws.lastRow.number, colXLen, listMerges);

    await workbook.xlsx.writeFile('tst.xlsx');
}

await createExcelReport({
    list: [[0, 1, 2,], [3, 4, 5,], [6, 7, 8,], [9, 10, 11,], [12, 13, 14,],], sum: 321
});