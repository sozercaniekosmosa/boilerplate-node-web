// @ts-ignore
import Excel, {Worksheet} from "exceljs";

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
            height?: number;
        };
        len: number;
    };
    cols: { len: number };
    validations: any[];
    autofilter: {};
    properties: {};
}

interface ConvertParams {
    path?: string; // Путь к файлу Excel (опционально)
    arrayBuffer?: ArrayBuffer; // Данные файла Excel в виде ArrayBuffer (опционально)
}

async function convertExcelToXSpreadsheet({path, arrayBuffer}: ConvertParams): Promise<XSpreadsheetSheet[]> {

    const workbook = new Excel.Workbook();

    if (path) await workbook.xlsx.readFile(path);
    else if (arrayBuffer) await workbook.xlsx.load(arrayBuffer)

    const sheets: XSpreadsheetSheet[] = [];

    workbook.eachSheet((worksheet: Worksheet, sheetId) => {
        const stylesMap = new Map<string, number>();
        const styles: any[] = [];
        const merges: string[] = [];
        const rows: XSpreadsheetSheet['rows'] = {len: 0};
        let maxCol = 0;


        // Обработка объединенных ячеек
        // @ts-ignore
        Object.entries(worksheet._merges).forEach(mergedRange => {
            // @ts-ignore
            merges.push(mergedRange[1].range);
        });

        // Сбор стилей и данных строк
        worksheet.eachRow({includeEmpty: false}, (row, rowNumber) => {
            const rowIndex = rowNumber - 1;
            const cells: { [key: number]: any } = {};

            row.eachCell({includeEmpty: false}, (cell, colNumber) => {
                const colIndex = colNumber - 1;
                maxCol = Math.max(maxCol, colIndex);

                // Проверка на объединение
                let merge: [number, number] | undefined;
                // @ts-ignore
                const _merges = worksheet._merges[cell.address]
                if (!_merges && cell.isMerged) return;
                if (_merges) {
                    const {top, bottom, left, right} = _merges
                    merge = [bottom - top, right - left];
                }

                // Получение текста ячейки
                const text = cell.value;

                // Определение стиля
                const cellStyle = getCellStyle(cell);
                const styleKey = JSON.stringify(cellStyle);
                if (!stylesMap.has(styleKey)) {
                    stylesMap.set(styleKey, styles.length);
                    styles.push(cellStyle);
                }
                const styleIndex = stylesMap.get(styleKey)!;

                cells[colIndex] = {
                    text,
                    style: styleIndex,
                    ...(merge && {merge})
                };
            });

            rows[rowIndex] = {cells};
            if (row?.height) rows[rowIndex].height = row.height;

            rows.len = Math.max(rows.len, rowIndex + 1);
        });

        // Определение заморозки
        let freeze = 'A1';
        const view = worksheet?.views?.[0];
        if (view?.state === 'frozen' && (view.xSplit! > 0 || view.ySplit! > 0)) {
            const freezeCol = view.xSplit ? getColumnLetter(view.xSplit + 1) : 'A';
            const freezeRow = view.ySplit ? view.ySplit + 1 : 1;
            freeze = `${freezeCol}${freezeRow}`;
        }

        // Сбор информации о столбцах
        let cols = {
            len: maxCol + 1 || 26 // Значение по умолчанию
        };

        const columnCount = worksheet.columnCount;
        for (let colX = 1; colX <= columnCount; colX++) {
            const column = worksheet.getColumn(colX);
            cols[colX] = {width: column.width};
        }


        sheets.push({
            name: worksheet.name,
            freeze,
            styles,
            merges,
            rows: {
                ...rows,
                len: rows.len || 100 // Значение по умолчанию
            },
            cols,
            validations: [],
            autofilter: {},
            properties: worksheet.properties
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
    if (cell.alignment?.vertical) {
        style.valign = cell.alignment.vertical;
    }
    if (cell.alignment?.wrapText) {
        style.textwrap = cell.alignment?.wrapText;
    }

    // Границы
    const borderTypes = ['top', 'left', 'bottom', 'right'] as const;
    const borders: any = {};
    let hasBorders = false;
    if (cell.border) {
        borderTypes.forEach(type => {
            if (cell.border[type]) {
                const {style: borderStyle, color} = cell.border[type];
                if (borderStyle) {
                    borders[type] = [borderStyle, `#${color?.argb?.slice(2) || '000'}`];
                    hasBorders = true;
                }
            }
        });
    }
    if (hasBorders) style.border = borders;

    // Шрифт
    if (cell.font) {
        const font: any = {};
        if (cell.font.name) font.name = cell.font.name;
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