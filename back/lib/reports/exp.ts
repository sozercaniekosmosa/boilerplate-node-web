import Excel from "exceljs";

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

export const exportToExcel = async (pathOut: string, sheetData: any) => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    Object.entries(sheetData.rows || {}).forEach(([rowIndex, row]: [string, any]) => {
        const rowNumber = parseInt(rowIndex) + 1;

        Object.entries(row.cells || {}).forEach(([colIndex, cellData]: [string, any]) => {
            const cell = worksheet.getCell(rowNumber, parseInt(colIndex) + 1);
            cell.value = cellData.text;

            if (cellData.style) {
                const style = convertStyle(sheetData.styles[cellData.style]);
                Object.assign(cell, {style});
            }
        });
    });

    sheetData.merges?.forEach((merge: string) => worksheet.mergeCells(merge));
    await workbook.xlsx.writeFile(pathOut);
};