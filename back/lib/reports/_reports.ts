import Excel from "exceljs";
import axios from "axios";

// console.log(process.cwd())

export function getListMerges(ws) {
    const listMerges = {};

    // @ts-ignore
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

function mergeApply(ws, listMerges) {
    for (let rowY = 1; rowY <= ws.lastRow.number; rowY++) {
        for (let colX = 1; colX <= ws.lastColumn.number; colX++) {
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

function fillValue(ws, data, offRowY, offColX) {

    // функция получения мастер-ячеек (непрерывных) для заполнения
    const getCellMaster = (rowY, offColX) => {
        let arrCell = [];
        for (let colX = offColX; colX <= ws.lastColumn.number; colX++) {
            const cell = ws.getCell(rowY, colX)
            if (cell.value !== '*') arrCell.push(cell); //если * - значит ячейка часть объедиенния и заполнять её ненадо
        }
        return arrCell;
    }

    if (!Array.isArray(data)) {
        const arrCellMaster = getCellMaster(offRowY, offColX);
        const cell = arrCellMaster[0];
        const value = data;
        const [val, key] = (cell.value + '')?.split('|')
        cell.value = key ? value + '|' + key : value;
    } else {

        // готовим место под данные
        ws.duplicateRow(offRowY, data.length - 1, true)

        // проходим по данным [ [..., ...], [..., ...], [..., ...], ... ] 2x - мерный массив
        for (let i = 0; i < data.length; i++) {
            let rowY = i + offRowY;
            const arrLine = data[i];
            const arrCellMaster = getCellMaster(rowY, offColX);
            if (arrLine.length > arrCellMaster.length) throw 'Разная ширина данных и таблицы'
            for (let j = 0; j < arrLine.length; j++) {
                const cell = arrCellMaster[j];
                const value = arrLine[j];
                const [_, key] = (cell.value + '')?.split('|')
                cell.value = key ? value + '|' + key : value;
            }
        }
    }
}

async function createReport(ws, clb) {

    const listMerges = getListMerges(ws);

    // обходим все ячейки поиск имен функций
    for (let rowY = 1; rowY <= ws.lastRow.number; rowY++) {
        for (let colX = 1; colX <= ws.lastColumn.number; colX++) {
            const cell = ws.getCell(rowY, colX);
            if (typeof cell.value === 'string' &&
                (cell.value?.startsWith('srv#') || cell.value?.startsWith('fn#'))
            ) {
                const [val, _] = cell.value.split('|');
                const data = await clb(val)
                fillValue(ws, data, rowY, colX);
            }
        }
    }

    mergeApply(ws, listMerges);
}

export const createExcelReport = async (pathTemplate, pathOut) => {

    const fn = await import('./fn')
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(pathTemplate);

    let ws = workbook.getWorksheet(1);

    await createReport(ws, async (cmdName) => {
        if (!/^[a-zA-Z][a-zA-Z0-9]+#[a-zA-Z0-9_]+$/.test(cmdName)) throw 'команда не существует'

        const [cmd, name] = cmdName.split('#');
        if (cmd === 'srv') {
            const {data} = await axios.get(`http://localhost:${3001}/${name}`)
            return data;
        } else if (cmd === 'fn') {
            return await fn[name]();
        }
    });

    await workbook.xlsx.writeFile(pathOut);
}
