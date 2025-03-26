import Spreadsheet from "x-data-spreadsheet"
import {createElement, useEffect, useRef, useState} from "react";
import ruRU from "./ru-RU.ts"
import sheetData from "./sheetData.ts";
import {getHtmlStr} from "../../lib/dom.ts";


function fillWidthToColumns(arrData) {
    // @ts-ignore
    return arrData.map(data => { //приведение ширины столбцов
        // @ts-ignore
        data.cols = Object.fromEntries(Object.entries(data.cols).map(([key, val]) => key != 'len' ? [key - 1, {width: val.width * 7}] : [key, val]))
        return data;
    })
}

function openFileDialog(acceptTypes) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = acceptTypes; // Указываем допустимые типы файлов
    inputElement.style.display = 'none';
    document.body.appendChild(inputElement);
    inputElement.click();
    inputElement.onchange = (e) => {
        // @ts-ignore
        const files = e.target.files;
        console.log(files); // Обрабатываем выбранные файлы
        document.body.removeChild(inputElement);
    };
}

const Report = ({data}) => {
    const refNodeSheet = useRef()

    const [doc, setDoc] = useState(data)

    useEffect(() => {
        Spreadsheet.locale('ru-RU', ruRU);

        setDoc(fillWidthToColumns(doc));

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
        s.loadData(doc) // load data
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


        setTimeout(() => {

            //language=html
            const btnOpen = getHtmlStr(`
                <div class="x-spreadsheet-toolbar-btn" data-tooltip="Загрузить шаблон">
                    <div class="bi-folder2-open"></div>
                </div>
            `);
            const btnSave = getHtmlStr(`
                <div class="x-spreadsheet-toolbar-btn" data-tooltip="Загрузить шаблон">
                    <div class="bi-floppy2-fill"></div>
                </div>
            `);

            btnOpen[0].addEventListener('click', (e) => {
                openFileDialog('xlsx')
                console.log(e)
            });
            btnSave[0].addEventListener('click', (e) => {
                console.log(e)
            });

            // @ts-ignore
            refNodeSheet.current.querySelector('.x-spreadsheet-toolbar-btns').prepend(btnSave[0]);
            // @ts-ignore
            refNodeSheet.current.querySelector('.x-spreadsheet-toolbar-btns').prepend(btnOpen[0]);

        }, 100)

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

export default Report;