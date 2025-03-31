import Excel, {Worksheet} from "exceljs";

const hexToArgb = (hex: string): string => {
    const cleanedHex = (hex?.replace('#', '') || '000000').replace(
        /^([a-f\d])([a-f\d])([a-f\d])$/i,
        '$1$1$2$2$3$3'
    );
    return `FF${cleanedHex.padEnd(6, '0').toUpperCase()}`;
};

const createExcelFont = (style: TCellStyle): TExcelFont | undefined => {
    if (!style.font) return undefined;

    return {
        name: style.font.name || 'Arial',
        size: style.font.size || 12,
        ...(style.font.bold && {bold: true}),
        ...(style.font.italic && {italic: true}),
        ...(style.font.color && {color: {argb: hexToArgb(style.font.color)}})
    };
};

const convertStyle = (style: TCellStyle): TExcelStyle => {
    const excelStyle: TExcelStyle = {};
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
                .map(([side, {style: s, color}]: [string, TBorderValue]) => [
                    side,
                    {style: s || 'thin', color: {argb: hexToArgb(color || '#000000')}}
                ])
        );
    }

    return excelStyle;
};

/**
 * задать ширину всем колонкам
 * @paramVal worksheet
 * @paramVal cols
 */
function fillWidthCols(worksheet: Worksheet, cols) {
    const arrCol = Object.entries(cols)
    for (let i = 0; i < arrCol.length; i++) {//задать ширину всем колонкам
        const [colX, col] = arrCol[i];
        // @ts-ignore
        if (col?.width) {
            try {

            // @ts-ignore
            worksheet.getColumn(+colX + 1).width = +col.width;
            }catch (e){
                console.log(e)
            }
        }
    }
}

export const exportToExcel = async (sheetData: TArraySheet, pathOut: string) => {
    const workbook = new Excel.Workbook();

    for (let i = 0; i < sheetData.length; i++) {
        const {name, cols, rows, styles} = sheetData[i];
        const worksheet = workbook.addWorksheet(name);

        fillWidthCols(worksheet, cols);

        const arrMerge = [];
        let arrRow = Object.entries(rows || {});
        for (let rowY = 0; rowY < arrRow.length; rowY++) {
            const [rowIndex, row]: [string, TRow] = arrRow[rowY];
            const rowNumber = parseInt(rowIndex) + 1;

            if (row?.height) {
                worksheet.getRow(rowNumber).height = row.height;
            }

            let arrCol = Object.entries(row.cells || {});
            for (let colX = 0; colX < arrCol.length; colX++) {
                const [colIndex, cellData]: [string, TCellData] = arrCol[colX];
                const cell = worksheet.getCell(rowNumber, parseInt(colIndex) + 1);
                cell.value = cellData.text;
                if (cellData.style !== undefined) {
                    const style = convertStyle(styles[cellData.style]);
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
    }

    await workbook.xlsx.writeFile(pathOut);
};