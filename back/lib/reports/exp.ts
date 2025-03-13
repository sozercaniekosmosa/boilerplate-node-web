import Excel from "exceljs";

// const sheetData = {
//     name: "sheet2",
//     freeze: "A1",
//     styles: [
//         {align: "center"},
//         {
//             border: {
//                 bottom: ["thin", "#000"],
//                 top: ["thin", "#000"],
//                 left: ["thin", "#000"],
//                 right: ["thin", "#000"]
//             }
//         }, {
//             align: "center",
//             border: {
//                 bottom: ["thin", "#000"],
//                 top: ["thin", "#000"],
//                 left: ["thin", "#000"],
//                 right: ["thin", "#000"]
//             }
//         }, {
//             border: {
//                 bottom: ["thin", "#000"],
//                 top: ["thin", "#000"],
//                 left: ["thin", "#000"],
//                 right: ["thin", "#000"]
//             }, font: {bold: true}
//         }],
//     merges: ["A2:B2"],
//     rows: {
//         0: {cells: {0: {text: "1", style: 1}, 1: {text: "2", style: 3}}},
//         1: {cells: {0: {merge: [0, 1], text: "3", style: 2}, 1: {style: 0}}},
//         len: 100
//     },
//     cols: {len: 26},
//     "validations": [],
//     "autofilter": {}
// }
const sheetData = {
    name: "sheet2",
    freeze: "A1",
    styles: [{align: "center"}, {
        border: {
            bottom: ["thin", "#000"],
            top: ["thin", "#000"],
            left: ["thin", "#000"],
            right: ["thin", "#000"]
        }
    }, {
        align: "center",
        border: {bottom: ["thin", "#000"], top: ["thin", "#000"], left: ["thin", "#000"], right: ["thin", "#000"]}
    }, {
        border: {bottom: ["thin", "#000"], top: ["thin", "#000"], left: ["thin", "#000"], right: ["thin", "#000"]},
        font: {bold: true}
    }, {
        align: "center",
        border: {bottom: ["thin", "#000"], top: ["thin", "#000"], left: ["thin", "#000"], right: ["thin", "#000"]},
        valign: "middle"
    }, {align: "center", valign: "middle"}],
    merges: ["A1:C1", "A2:B2", "B3:C3", "A3:A5", "B4:C5"],
    rows: {
        0: {cells: {0: {merge: [0, 2], style: 4, text: "1"}, 1: {style: 5}, 2: {style: 5}}},
        1: {cells: {0: {merge: [0, 1], style: 4, text: "2"}, 1: {style: 5}, 2: {style: 4, text: "3"}}},
        2: {cells: {0: {merge: [2, 0], style: 4, text: "4"}, 1: {merge: [0, 1], style: 4, text: "5"}, 2: {style: 5}}},
        3: {cells: {0: {text: "4", style: 5}, 1: {merge: [1, 1], style: 4, text: "6"}, 2: {style: 5}}},
        4: {cells: {0: {style: 5}, 1: {style: 4}, 2: {style: 4}}},
        len: 100
    },
    cols: {len: 26},
    validations: [],
    autofilter: {}
}


function hexToArgb(hex) {
    if (!hex) return 'FF000000';
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    return 'FF' + hex.padEnd(6, '0').toUpperCase();
}

function convertStyle(style) {
    const excelStyle = {};

    // Font styles
    if (style.font) {
        // @ts-ignore
        excelStyle.font = {
            name: style.font.name || 'Arial',
            size: style.font.size || 12,
            bold: !!style.font.bold,
            italic: !!style.font.italic,
            color: {argb: hexToArgb(style.font.color)}
        };
    }

    // Text alignment
    if (style.align || style.valign) {
        // @ts-ignore
        excelStyle.alignment = {
            horizontal: style.align || 'left',
            vertical: style.valign || 'top'
        };
    }

    // Text wrapping
    if (style.textwrap) {
        // @ts-ignore
        excelStyle.alignment = excelStyle.alignment || {};
        // @ts-ignore
        excelStyle.alignment.wrapText = true;
    }

    // Text decoration
    if (style.strike) {
        // @ts-ignore
        excelStyle.font = excelStyle.font || {};
        // @ts-ignore
        excelStyle.font.strike = true;
    }

    if (style.underline) {
        // @ts-ignore
        excelStyle.font = excelStyle.font || {};
        // @ts-ignore
        excelStyle.font.underline = true;
    }

    // Background color
    if (style.bgcolor) {
        // @ts-ignore
        excelStyle.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: hexToArgb(style.bgcolor)}
        };
    }

    // Borders
    if (style.border) {
        // @ts-ignore
        excelStyle.border = {};
        const sides = ['top', 'bottom', 'left', 'right'];
        sides.forEach(side => {
            if (style.border[side]) {
                // @ts-ignore
                excelStyle.border[side] = {
                    style: style.border[side].style || 'thin',
                    color: {argb: hexToArgb(style.border[side].color)}
                };
            }
        });
    }

    return excelStyle;
}

export async function exportToExcel(pathOut) {
    // const wb = new Excel.Workbook();
    // await wb.xlsx.readFile('../tmp/exp.xlsx');
    // let ws = wb.getWorksheet(1);
    // console.log(ws)

    const workbook = new Excel.Workbook();
    // await workbook.xlsx.readFile(fileName);
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Process rows and cells
    if (sheetData.rows) {
        const arrKVRows = Object.entries(sheetData.rows);
        // @ts-ignore
        arrKVRows.forEach(([key, row], rowIndex) => {
            const rowNumber = rowIndex + 1;
            // @ts-ignore
            if (row.cells) {
                // @ts-ignore
                Object.keys(row.cells).forEach(colIndexStr => {
                    const colIndex = parseInt(colIndexStr, 10);
                    // @ts-ignore
                    const cellData = row.cells[colIndex];
                    const cell = worksheet.getCell(rowNumber, colIndex + 1);

                    // Set cell value
                    cell.value = cellData.text;

                    // Apply styles
                    if (cellData.style) {
                        const style = convertStyle(sheetData.styles[cellData.style]);
                        Object.assign(cell, {style});
                    }
                });
            }
        });
    }

    // Process merged cells
    sheetData.merges?.forEach(merge => worksheet.mergeCells(merge));

    // Save to file
    await workbook.xlsx.writeFile(pathOut);
}