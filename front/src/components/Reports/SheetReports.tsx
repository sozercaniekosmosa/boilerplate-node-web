import Spreadsheet from "x-data-spreadsheet"
import {useEffect, useRef, useState} from "react";
import ruRU from "./ru-RU.ts"
import {getHtmlStr} from "../../lib/dom.ts";
import convertExcelToXSpreadsheet from "./import.ts";
import {getHashCyrb53Arr, throttle} from "../../lib/utils.ts";


/**
 * Открывает диалоговое окно для выбора файла.
 * @param {string} acceptTypes - строка с типами через [,] определяющих допустимые типы файлов (например, '.pdf').
 * @returns {Promise<File>} - Промис, который разрешается выбранным файлом.
 */
const openFileDialog = async (acceptTypes: string): Promise<ArrayBuffer> => new Promise((resolve, reject) => {
    // Создаем элемент <input type="file">
    const input = document.createElement('input');
    input.type = 'file';

    // Устанавливаем допустимые типы файлов
    input.accept = acceptTypes; // Указываем допустимые типы файлов

    // Обработчик выбора файла
    input.onchange = () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const arrayBuffer = event.target.result;
                resolve(arrayBuffer as ArrayBuffer); // Разрешаем промис выбранным файлом
            };
            reader.readAsArrayBuffer(file);
        } else {
            reject(new Error('Файл не выбран'));
        }
    };

    // Обработчик ошибок
    input.onerror = () => {
        reject(new Error('Произошла ошибка при выборе файла'));
    };

    // Открываем диалоговое окно
    input.click();
});

let ver = 0;
let properties = [];

function addProperties(sheet: Record<string, any>) {
    return sheet.map((it, i) => {
        it.properties = properties[i];
        if (i == 0) {
            ver = Date.now();
            it.properties.ver = ver
        }
        return it;
    })
}

function fillWidthToColumns(arrData, kWidth = 7) {
    // @ts-ignore
    if (arrData[0].properties?.ver) return arrData;
    const res = arrData.map((data, i) => { //приведение ширины столбцов
        // @ts-ignore
        data.cols = Object.fromEntries(Object.entries(data.cols).map(([key, val]) => key != 'len' ? [key - 1, {width: val.width * kWidth}] : [key, val]))
        return data;
    })
    res[0].properties.ver = Date.now();
    return res;
}

const SheetReports = ({data, setData, height = 40}) => {

    const [spreadsheet, setSpreadsheet] = useState<Spreadsheet>()
    const refNodeSheet = useRef()
    const refSave = useRef()

    useEffect(() => {
        if (!spreadsheet) return;
        const doc = fillWidthToColumns(data, 7);
        properties = doc.map(it => it.properties);
        if (doc?.[0] && doc[0]?.properties && doc[0].properties?.ver && doc[0].properties.ver == ver) return;
        spreadsheet.loadData(doc) // load data
        ver = doc[0].properties.ver;
    }, [data]);

    const save = throttle((s: Spreadsheet) => {
        let sheet = s.getData();
        sheet = addProperties(sheet);
        setData(sheet);
        console.log('store')
        // @ts-ignore
        refSave.current.classList.remove('rotY')
    }, 1000);

    useEffect(() => {

        Spreadsheet.locale('ru-RU', ruRU);

        const s = new Spreadsheet(refNodeSheet.current, {
            mode: 'edit', // edit | read
            showToolbar: true,
            showGrid: true,
            showContextmenu: true,
            showBottomBar: true,
            view: {
                height: () => document.documentElement.clientHeight - height,
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

        setSpreadsheet(s); // необходимо привязать компонент к React-состоянию что бы иметь к нему доступ позже
        // s.loadData(data) // load data
        s.change(data => {
            // @ts-ignore
            refSave.current.classList.add('rotY')
            save(s);
        })
        s.on('cell-selected', (cell, ri, ci) => {
            // console.log(cell)
        });
        s.on('cells-selected', (cell, {sri, sci, eri, eci}) => {
            // console.log(cell)
        });
        s.on('cell-edited', (text, ri, ci) => {
            // @ts-ignore
            // console.log(s.cellStyle(ri, ci))
        });


        setTimeout(() => {
            //language=html
            const btnOpen = getHtmlStr(`
                <div class="x-spreadsheet-toolbar-btn" title="Загрузить шаблон">
                    <div class="bi-folder2-open" style="font-size: 1.2em; color: #4d4d4d"/>
                </div>
            `);
            const btnSave = getHtmlStr(`
                <div class="x-spreadsheet-toolbar-btn" title="Сохранить шаблон">
                    <div class="bi-floppy2-fill" style="font-size: 1.2em; color: #4d4d4d"/>
                </div>
            `);

            // @ts-ignore
            refSave.current = btnSave[0].children[0];

            btnOpen[0].addEventListener('click', async (e) => {
                const arrayBuffer = await openFileDialog('xlsx');
                let sheet = await convertExcelToXSpreadsheet({arrayBuffer});
                sheet = fillWidthToColumns(sheet, 7);
                setData(sheet);
            });
            btnSave[0].addEventListener('click', () => {
                // @ts-ignore
                refSave.current.classList.add('rotY')
                save(s);
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
//@ts-ignore
export default SheetReports;