// @ts-ignore
import Excel from "exceljs";

interface XSpreadsheetSheet {
    name: string;
    freeze: string;
    styles: any[];
    merges: string[];
    rows: {
        [key: number]: {
            cells: {
                [key: number]: {
                    text: string;
                    style?: number;
                    merge?: [number, number];
                };
            };
        };
        len: number;
    };
    cols: { len: number };
    validations: any[];
    autofilter: {};
}

async function convertExcelToXSpreadsheet(path: string): Promise<XSpreadsheetSheet[]> {
    // const workbook = new Excel.Workbook();
    // await workbook.xlsx.load(excelBuffer);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path);

    const sheets: XSpreadsheetSheet[] = [];

    workbook.eachSheet((worksheet, sheetId) => {
        const stylesMap = new Map<string, number>();
        const styles: any[] = [];
        const merges: string[] = [];
        const rows: XSpreadsheetSheet['rows'] = {len: 0};
        let maxCol = 0;

        // Обработка объединенных ячеек
        Object.entries(worksheet._merges).forEach(mergedRange => {
            // const {start, end} = mergedRange;
            // const mergeString = `${getCellAddress(start.row, start.col)}:${getCellAddress(end.row, end.col)}`;
            merges.push(mergedRange[1].range);
        });

        // Сбор стилей и данных строк
        worksheet.eachRow({includeEmpty: false}, (row, rowNumber) => {
            const rowIndex = rowNumber - 1;
            const cells: { [key: number]: any } = {};

            row.eachCell({includeEmpty: false}, (cell, colNumber) => {
                const colIndex = colNumber - 1;
                maxCol = Math.max(maxCol, colIndex);

                // Получение текста ячейки
                const text = cell.text;

                // Определение стиля
                const cellStyle = getCellStyle(cell);
                const styleKey = JSON.stringify(cellStyle);
                if (!stylesMap.has(styleKey)) {
                    stylesMap.set(styleKey, styles.length);
                    styles.push(cellStyle);
                }
                const styleIndex = stylesMap.get(styleKey)!;

                // Проверка на объединение
                let merge: [number, number] | undefined;
                const isMerged = worksheet.isMerged(cell);
                if (isMerged) {
                    const mergedRange = worksheet.mergedCells.find(m => m.startRow === cell.row && m.startColumn === cell.column);
                    if (mergedRange && mergedRange.startRow === cell.row && mergedRange.startColumn === cell.column) {
                        const colsMerged = mergedRange.endColumn - mergedRange.startColumn;
                        const rowsMerged = mergedRange.endRow - mergedRange.startRow;
                        merge = [colsMerged, rowsMerged];
                    }
                }

                cells[colIndex] = {
                    text,
                    style: styleIndex,
                    ...(merge && {merge})
                };
            });

            rows[rowIndex] = {cells};
            rows.len = Math.max(rows.len, rowIndex + 1);
        });

        // Определение заморозки
        let freeze = 'A1';
        const view = worksheet.views[0];
        if (view?.state === 'frozen' && (view.xSplit! > 0 || view.ySplit! > 0)) {
            const freezeCol = view.xSplit ? getColumnLetter(view.xSplit + 1) : 'A';
            const freezeRow = view.ySplit ? view.ySplit + 1 : 1;
            freeze = `${freezeCol}${freezeRow}`;
        }

        // Сбор информации о столбцах
        const colsLen = maxCol + 1;

        sheets.push({
            name: worksheet.name,
            freeze,
            styles,
            merges,
            rows: {
                ...rows,
                len: rows.len || 100 // Значение по умолчанию
            },
            cols: {
                len: colsLen || 26 // Значение по умолчанию
            },
            validations: [],
            autofilter: {}
        });
    });

    return sheets;
}

function getCellStyle(cell: Excel.Cell): any {
    const style: any = {};

    // Выравнивание
    if (cell.alignment?.horizontal) {
        style.align = cell.alignment.horizontal;
    }

    // Границы
    const borderTypes = ['top', 'left', 'bottom', 'right'] as const;
    const borders: any = {};
    let hasBorders = false;
    borderTypes.forEach(type => {
        const border = cell.border[type];
        if (border?.style && border.color) {
            borders[type] = [border.style, border.color.argb];
            hasBorders = true;
        }
    });
    if (hasBorders) style.border = borders;

    // Шрифт
    if (cell.font) {
        const font: any = {};
        if (cell.font.bold) font.bold = true;
        if (cell.font.italic) font.italic = true;
        if (cell.font.size) font.size = cell.font.size;
        if (cell.font.color?.argb) font.color = cell.font.color.argb;
        if (Object.keys(font).length) style.font = font;
    }

    // Заливка
    if (cell.fill?.type === 'pattern' && cell.fill.fgColor?.argb) {
        style.fill = {bgColor: cell.fill.fgColor.argb};
    }

    return style;
}

function getColumnLetter(columnNumber: number): string {
    let letter = '';
    while (columnNumber > 0) {
        const remainder = (columnNumber - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return letter;
}

function getCellAddress(row: number, column: number): string {
    return `${getColumnLetter(column)}${row}`;
}

export default convertExcelToXSpreadsheet;