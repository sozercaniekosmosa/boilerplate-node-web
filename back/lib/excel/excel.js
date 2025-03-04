import Excel from "exceljs";

// console.log(process.cwd())


function getMergeRangeForCell(worksheet, rowY, colX) {
    // @ts-ignore
    const merges = Object.values(worksheet._merges).map(it => it.model);

    for (const merge of merges) {
        if (rowY >= merge.top && rowY <= merge.bottom && colX >= merge.left && colX <= merge.right) {
            return merge;
        }
    }

    return null; // Если ячейка не принадлежит ни одному объединенному диапазону
}

function duplicateRows(ws, offRowY, quan) {
    const arrRow = []
    const colXLen = ws.lastColumn.number;

    for (let colX = 1; colX <= colXLen; colX++) {
        let cell = ws.getCell(offRowY, colX);
        const {value, style, note} = cell
        // console.log(value, style, note)
        arrRow.push({value, style, note})
    }

    ws.duplicateRow(2, quan - 1, true)

    // ws.mergeCells(2, 2, 2, 3);
    // ws.mergeCells(3, 2, 3, 3);
    // ws.mergeCells(4, 2, 4, 3);
    // ws.mergeCells(5, 2, 5, 3);
    // ws.mergeCells(6, 2, 6, 3);

    console.log(arrRow)
    for (let i = 0; i < quan; i++) {
        const rowY = i + offRowY;
        for (let j = 0; j < arrRow.length; j++) {
            const colX = j + 1;
            const {value, style, note} = arrRow[j];
            const cell = ws.getCell(rowY, colX)
            cell.value = value;
            cell.style = style;
            if (note) cell.note = note;

            // if (note) {
            //     const {h, w} = JSON.parse(note);
            //     let dim = [rowY, j + 1, rowY + h, j + 1 + w];
            //     ws.mergeCells(...dim);
            //     // ws
            // } else {
            //
            // }
        }
    }
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
        cell.value += '|' + key
        ws.unMergeCells(addr);
    }
    return listMerges;
}

function mergeApply(ws, rowYLen, colXLen, listMerges) {
    for (let rowY = 1; rowY <= rowYLen; rowY++) {
        for (let colX = 1; colX <= colXLen; colX++) {
            const cell = ws.getCell(rowY, colX);
            const [val, key] = (cell.value + '')?.split('|')
            if (key && !cell.isMerged) {
                cell.value = val;
                const {h, w} = listMerges[key];
                let dim = [rowY, colX, rowY + h, colX + w];
                ws.mergeCells(...dim);
            }
        }
    }
}

export const createExcelReport = async (data) => {

    const arrKeys = Object.keys(data);
    console.log(arrKeys)
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('template.xlsx');
    //

    let ws = workbook.getWorksheet(1);
    let rowYLen = ws.lastRow.number;
    const colXLen = ws.lastColumn.number;

    // worksheet.addRow(2, [3, 'Sam', new Date()]);
    // worksheet.insertRow(2, [3, 'Sam', new Date()], 'o+');
    // insertLines(worksheet, {indexRow: 3, quantity: 10})
    // console.log(Object.values(w._merges).map(it => it.model))

    const listMerges = getListMerges(ws);

    const offRowY = 2;
    const quan = 22

    duplicateRows(ws, offRowY, quan);

    // row.commit();

    // for (let rowY = 1; rowY <= rowYLen; rowY++) {
    //     for (let colX = 1; colX <= colXLen; colX++) {
    //         const cell = ws.getCell(rowY, colX);
    //         for (let i = 0; i < arrKeys.length; i++) {
    //             const key = arrKeys[i];
    //             if (cell.value?.includes && cell.value?.includes(key)) {
    //                 if (Array.isArray(data[key])) {
    //                     fillData(ws, rowY, colX, data[key]);
    //                     rowYLen = ws.lastRow.number;
    //                     rowY += Array.isArray(data[key]) ? data[key].length : 0;
    //                 } else {
    //                     cell.value = data[key]
    //                 }
    //             }
    //
    //         }
    //     }
    // }

    mergeApply(ws, rowYLen + quan, colXLen, listMerges);

    const r = ws.getRow(2)
    console.log(r)

    // console.log(data)

    await workbook.xlsx.writeFile('tst.xlsx');
}

await createExcelReport({
    list: [[0, 1, 2,], [3, 4, 5,], [6, 7, 8,], [9, 10, 11,], [12, 13, 14,],], sum: 321
});