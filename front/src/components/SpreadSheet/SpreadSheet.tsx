import Spreadsheet from "x-data-spreadsheet"
import {useEffect, useRef} from "react";
import ruRU from "./ru-RU.ts"

const SpreadSheet = () => {
    const refNodeSheet = useRef()
    useEffect(() => {
        Spreadsheet.locale('ru-RU', ruRU);
        const s = new Spreadsheet(refNodeSheet.current, {
            mode: 'edit', // edit | read
            showToolbar: true,
            showGrid: true,
            showContextmenu: true,
            showBottomBar: true,
            view: {
                height: () => document.documentElement.clientHeight - 40,
                width: () => document.documentElement.clientWidth,
            },
            row: {
                len: 100,
                height: 25,
            },
            col: {
                len: 26,
                width: 100,
                indexWidth: 60,
                minWidth: 60,
            },
            style: {
                bgcolor: '#ffffff',
                align: 'left',
                valign: 'middle',
                textwrap: false,
                strike: false,
                underline: false,
                color: '#0a0a0a',
                font: {
                    name: 'Helvetica',
                    size: 10,
                    bold: false,
                    italic: false,
                },
            },
        })
        s.loadData([{
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
                        15: {text: "16"}
                    }
                },
                1: {
                    cells: {
                        0: {text: "fn#list"},
                    }
                },
                len: 100
            },
            cols: {len: 26},
            validations: [],
            autofilter: {}
        }]) // load data
        s.change(data => {
            // console.log(data);
        })
        s.on('cell-selected', (cell, ri, ci) => {
        });
        s.on('cells-selected', (cell, {sri, sci, eri, eci}) => {
        });
        s.on('cell-edited', (text, ri, ci) => {

            // @ts-ignore
            console.log(s.cellStyle(ri, ci))
        });

        // cell(ri, ci, sheetIndex = 0)
        // s.cell(ri, ci);
        // cellStyle(ri, ci, sheetIndex = 0)
        // s.cellStyle(ri, ci);

        // s.cellText(5, 5, 'xxxx').cellText(6, 5, 'yyy')
        // @ts-ignore
        // s.reRender();


        // @ts-ignore
        s.validate()

        // @ts-ignore
        window.spreadsheet = s;
        // @ts-ignore
        window.save = () => {
            // @ts-ignore
            // XLSX.writeFile(xtos(s.getData()), "SheetJS.xlsx");
        };
    }, []);

    return <div ref={refNodeSheet}/>;
}

export default SpreadSheet;