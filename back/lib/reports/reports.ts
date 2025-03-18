import axios from "axios";
import {exportToExcel} from "./export";
import {fillDataToSheet} from "./dataHandling";

// @ts-ignore
const sheetData: TSheetData = {
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
        border: {
            bottom: ["thin", "#000"],
            top: ["thin", "#000"],
            left: ["thin", "#000"],
            right: ["thin", "#000"]
        }
    }, {
        border: {
            bottom: ["thin", "#000"],
            top: ["thin", "#000"],
            left: ["thin", "#000"],
            right: ["thin", "#000"]
        }, font: {bold: true}
    }],
    merges: [],
    rows: {
        0: {
            cells: {
                0: {text: "1"},
                1: {text: "2"},
                2: {text: "3"},
                3: {text: "4"},
                4: {text: "5"},
                5: {text: "6"},
                6: {text: "7"},
                7: {text: "8"},
                8: {text: "9"},
                9: {text: "10"},
                10: {text: "11"},
                11: {text: "12"},
                12: {text: "13"},
                13: {text: "14"},
                14: {text: "15"},
                15: {text: "16"},
            }
        },
        1: {
            cells: {
                0: {text: "fn#list"},
                1: {text: ""},
                2: {text: ""},
                3: {text: ""},
                4: {text: ""},
                5: {text: ""},
                6: {text: ""},
                7: {text: ""},
                8: {text: ""},
                9: {text: ""},
                10: {text: ""},
                11: {text: ""},
                12: {text: ""},
                13: {text: ""},
                14: {text: ""},
                15: {text: ""},
                16: {text: ""},
                17: {text: ""},
            }
        },
        len: 100
    },
    cols: {len: 26},
    validations: [],
    autofilter: {}
}

export const reports = async (path, pathTemplate?) => {

    const fn = await import('./fn');

    const sd = await fillDataToSheet(sheetData, async (cmd: string, name: string) => {
        let arrDataReceived: any[] | undefined;
        if (cmd === 'srv') {
            const {data} = await axios.get(`http://localhost:${3001}/${name}`);
            arrDataReceived = data;
        } else if (cmd === 'fn') {
            arrDataReceived = await fn[name]();
        }
        return arrDataReceived;
    })
    await exportToExcel(sd, path);
}
