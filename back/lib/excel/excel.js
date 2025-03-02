import Excel from "exceljs";
import {dirname} from "path";


// console.log(process.cwd())

const fillData = (worksheet, offY, offX, data) => {

    let arrData = data;

    if (!Array.isArray(arrData)) {
        arrData = [[arrData]];
    }

    if (!Array.isArray(arrData[0])) {
        arrData = [arrData];
    }

    const arrMaskValues = worksheet.getRow(offY).model.cells.map(({value}) => value)

    for (let i = 0; i < arrData.length; i++) {
        const _arr = [...arrData[i]]
        arrData[i] = [...arrMaskValues]
        for (let j = 0; j < _arr.length; j++) {
            arrData[i][j + offY - 1] = _arr[j]
        }
    }

    arrData = arrData.reverse();

    for (let i = 0; i < arrData[0].length; i++) {
        const it = arrData[0][i];
        worksheet.getCell(offY, i + 1).value = it;
    }

    for (let i = 1; i < arrData.length; i++) {
        const line = arrData[i];
        worksheet.insertRow(offY, line, 'o+');
    }


}

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

export const createExcelReport = async (data) => {

    const arrKeys = Object.keys(data);
    console.log(arrKeys)
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('template.xlsx');
    //
    let worksheet = workbook.getWorksheet(1);
    // worksheet.addRow(2, [3, 'Sam', new Date()]);
    //
    // worksheet.insertRow(2, [3, 'Sam', new Date()], 'o+');


    // insertLines(worksheet, {indexRow: 3, quantity: 10})

    let rowYLen = worksheet.lastRow.number;
    const colXLen = worksheet.lastColumn.number;

    for (let rowY = 1; rowY <= rowYLen; rowY++) {
        for (let colX = 1; colX <= colXLen; colX++) {
            const cell = worksheet.getCell(rowY, colX);
            for (let i = 0; i < arrKeys.length; i++) {
                const key = arrKeys[i];
                if (cell.value?.includes && cell.value?.includes(key)) {
                    if (Array.isArray(data[key])) {
                        fillData(worksheet, rowY, colX, data[key]);
                        rowYLen = worksheet.lastRow.number;
                        rowY += Array.isArray(data[key]) ? data[key].length : 0;
                    } else {
                        cell.value = data[key]
                    }
                }

            }
        }
    }

    // console.log(data)

    await workbook.xlsx.writeFile('tst.xlsx');
}

await createExcelReport({
    list: [[0, 1, 2,], [3, 4, 5,], [6, 7, 8,], [9, 10, 11,], [12, 13, 14,],],
    sum: 321
});