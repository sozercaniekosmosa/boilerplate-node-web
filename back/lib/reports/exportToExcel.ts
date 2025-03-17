import Excel from "exceljs";
import axios from "axios";

// import fn from "./fn";

interface ExcelFont {
    name: string;
    size: number;
    bold?: boolean;
    italic?: boolean;
    strike?: boolean;
    underline?: boolean;
    color?: { argb: string };
}

interface ExcelBorder {
    style: string;
    color: { argb: string };
}

interface ExcelStyle {
    font?: ExcelFont;
    alignment?: {
        horizontal: string;
        vertical: string;
        wrapText?: boolean;
    };
    fill?: {
        type: string;
        pattern: string;
        fgColor: { argb: string };
    };
    border?: Record<string, ExcelBorder>;
}

interface CellStyle {
    font?: {
        name?: string;
        size?: number;
        bold?: boolean;
        italic?: boolean;
        color?: string;
    };
    align?: string;
    valign?: string;
    textwrap?: boolean;
    strike?: boolean;
    underline?: boolean;
    bgcolor?: string;
    border?: Record<string, { style?: string; color?: string }>;
}

const hexToArgb = (hex: string): string => {
    const cleanedHex = (hex?.replace('#', '') || '000000').replace(
        /^([a-f\d])([a-f\d])([a-f\d])$/i,
        '$1$1$2$2$3$3'
    );
    return `FF${cleanedHex.padEnd(6, '0').toUpperCase()}`;
};

const createExcelFont = (style: CellStyle): ExcelFont | undefined => {
    if (!style.font) return undefined;

    return {
        name: style.font.name || 'Arial',
        size: style.font.size || 12,
        ...(style.font.bold && {bold: true}),
        ...(style.font.italic && {italic: true}),
        ...(style.font.color && {color: {argb: hexToArgb(style.font.color)}})
    };
};

const convertStyle = (style: CellStyle): ExcelStyle => {
    const excelStyle: ExcelStyle = {};
    const font = createExcelFont(style);

    if (font) {
        excelStyle.font = font;
        if (style.strike) excelStyle.font.strike = true;
        if (style.underline) excelStyle.font.underline = true;
    }

    if (style.align || style.valign || style.textwrap) {
        excelStyle.alignment = {
            horizontal: style.align || 'left',
            vertical: style.valign || 'top',
            ...(style.textwrap && {wrapText: true})
        };
    }

    if (style.bgcolor) {
        excelStyle.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: hexToArgb(style.bgcolor)}
        };
    }

    if (style.border) {
        excelStyle.border = Object.fromEntries(
            Object.entries(style.border)
                .filter(([_, value]) => value)
                .map(([side, {style: s, color}]) => [
                    side,
                    {style: s || 'thin', color: {argb: hexToArgb(color || '#000000')}}
                ])
        );
    }

    return excelStyle;
};

export const exportToExcel = async (sheetData: any, pathOut: string) => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    const arrMerge = [];

    let arrRow = Object.entries(sheetData.rows || {});
    for (let rowY = 0; rowY < arrRow.length; rowY++) {
        const [rowIndex, row]: [string, any] = arrRow[rowY];
        const rowNumber = parseInt(rowIndex) + 1;

        let arrCol = Object.entries(row.cells || {});
        for (let colX = 0; colX < arrCol.length; colX++) {
            const [colIndex, cellData]: [string, any] = arrCol[colX];
            const cell = worksheet.getCell(rowNumber, parseInt(colIndex) + 1);
            cell.value = cellData.text;

            if (cellData.style) {
                const style = convertStyle(sheetData.styles[cellData.style]);
                Object.assign(cell, {style});
            }

            if (cellData?.merge) {
                let sr = rowNumber;
                let sc = parseInt(colIndex) + 1;
                let er = sr + cellData.merge[0];
                let ec = sc + cellData.merge[1];
                arrMerge.push([sr, sc, er, ec])
            }
        }
    }

    arrMerge.forEach(([sr, sc, er, ec]) => worksheet.mergeCells(sr, sc, er, ec))

    // sheetData.merges?.forEach((merge: string) => worksheet.mergeCells(merge));
    await workbook.xlsx.writeFile(pathOut);
};

function fillData(rowCell, arr: any[]) {
    const arrRes = [];
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        let it = structuredClone(rowCell)
        const arrItem = Object.entries(it || {})
        for (let j = 0; j < arrItem.length; j++) {
            it[j].text = arr[i][j];
        }
        // Object.entries(it || {}).forEach(([colIndex, cellData]: [string, any]) => {
        //     it[colIndex].text = arr[i][colIndex];
        // })
        arrRes.push(it);
    }

    return arrRes;
}

export const exp = async (sheetData: any) => {

    // rows: {
    //     0: {cells: {0: {merge: [0, 2], style: 4, text: "1"}, 1: {style: 5}, 2: {style: 5}}},
    //     1: {cells: {0: {merge: [0, 1], style: 4, text: "2"}, 1: {style: 5}, 2: {style: 4, text: "3"}}},
    //     2: {cells: {0: {merge: [2, 0], style: 4, text: "4"}, 1: {merge: [0, 1], style: 4, text: "5"}, 2: {style: 5}}},
    //     3: {cells: {0: {text: "4", style: 5}, 1: {merge: [1, 1], style: 4, text: "6"}, 2: {style: 5}}},
    //     4: {cells: {0: {style: 5}, 1: {style: 4}, 2: {style: 4}}},
    //     len: 100
    // },

    const fn = await import('./fn')
    let tmpArrRow = []
    let arrAdd;
    let arrRow = Object.entries(sheetData.rows || {});
    for (let rowY = 0; rowY < arrRow.length; rowY++) {
        const [rowIndex, row] = arrRow[rowY];
        // @ts-ignore
        row?.cells && tmpArrRow.push(row.cells);
        // @ts-ignore

        const arrCol = Object.entries(row.cells || {});
        for (let celX = 0; celX < arrCol.length; celX++) {
            // @ts-ignore
            const [colIndex, cellData] = arrCol[celX];
            // @ts-ignore
            const cmdName = cellData.text;

            console.log(cmdName)
            if (typeof cmdName != 'string') continue;
            const [cmd, name] = cmdName.split('#');
            if (cmd === 'srv') {
                const {data} = await axios.get(`http://localhost:${3001}/${name}`)
                data;
            } else if (cmd === 'fn') {
                // if (!/^[a-zA-Z][a-zA-Z0-9]+#[a-zA-Z0-9_]+$/.test(cmdName)) throw 'команда не существует'
                const arr = await fn[name]();
                // @ts-ignore
                arrAdd = fillData(row.cells, arr)
                tmpArrRow = [...tmpArrRow, ...arrAdd]
            }
        }
    }
    for (let i = 0; i < tmpArrRow.length; i++) {
        sheetData.rows[i] = {cells: tmpArrRow[i]};
    }
    console.log(tmpArrRow)
    console.log(arrAdd)
}