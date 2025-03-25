import Spreadsheet from "x-data-spreadsheet"
import {useEffect, useRef} from "react";
import ruRU from "./ru-RU.ts"
import sheetData from "./sheetData.ts";


const SpreadSheet = () => {
    const refNodeSheet = useRef()
    useEffect(() => {
        Spreadsheet.locale('ru-RU', ruRU);

        let arrData = structuredClone(sheetData);

        // @ts-ignore
        arrData = arrData.map(data => {
            // @ts-ignore
            data.cols = Object.fromEntries(Object.entries(data.cols).map(([key, val]) => key != 'len' ? [key - 1, {width: val.width * 7}] : [key, val]))
            return data;
        })


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
                minWidth: 10,
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
        s.loadData(arrData) // load data
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