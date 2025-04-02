import Spreadsheet from "x-data-spreadsheet"
import React, {useEffect, useRef, useState} from "react";
import ruRU from "./ru-RU.ts"
import {getHtmlStr} from "../../lib/dom.ts";
import convertExcelToXSpreadsheet from "./import.ts";
import {debounce, getHashCyrb53Arr, throttle} from "../../lib/utils.ts";
import Dialog from "../Dialog/Dialog.tsx";


/**
 * Открывает диалоговое окно для выбора файла.
 * @paramVal {string} acceptTypes - строка с типами через [,] определяющих допустимые типы файлов (например, '.pdf').
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


const classAnim = 'zoom-out'
let didInit = false;
let properties = [];
let clbConfirm;

function addProperties(sheet: Record<string, any>) {
    return sheet.map((it, i) => {
        it.properties = properties[i];
        return it;
    })
}

function fillWidthToColumns(arrData) {
    return structuredClone(arrData).map((data, i) => { //приведение ширины столбцов
        // @ts-ignore
        data.cols = Object.fromEntries(Object.entries(data.cols).map(([key, val]) => key != 'len' ? [key - 1, {width: val.width}] : [key, val]))
        return data;
    })
}

function fillWidthToColumnsExt(arrData) {
    return structuredClone(arrData).map((data, i) => { //приведение ширины столбцов
        // @ts-ignore
        data.cols = Object.fromEntries(Object.entries(data.cols).map(([key, val]) => key != 'len' ? [key, {width: val.width * 7}] : [key, val]))
        return data;
    })
}

function fillWidthToColumnsContract(arrSheet) {
    return structuredClone(arrSheet).map(data => { //приведение ширины столбцов
        // @ts-ignore
        data.cols = Object.fromEntries(Object.entries(data.cols).map(([key, val]) => key != 'len' ? [key, {width: val.width * 1 / 7}] : [key, val]))
        return data;
    })
}

function createSpreadSheet(refNodeSheet: React.MutableRefObject<undefined>, height: number) {
    return new Spreadsheet(refNodeSheet.current, {
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
    });
}

const SheetReports = ({doc, setDoc, height = 40}) => {

    const [spreadsheet, setSpreadsheet] = useState<Spreadsheet>()
    const refNodeSheet = useRef()
    const refSave = useRef()
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {

        Spreadsheet.locale('ru-RU', ruRU);

        const s = createSpreadSheet(refNodeSheet, height)
        setSpreadsheet(s); // необходимо привязать компонент к React-состоянию что бы иметь к нему доступ позже
        // s.loadData(doc) // load doc

        setTimeout(() => {
            //language=html
            const btnNew = getHtmlStr(`
                <div class="x-spreadsheet-toolbar-btn" title="Новый документ">
                    <div class="bi-file-earmark" style="font-size: 1.3em; color: #4d4d4d"/>
                </div>
            `);
            const btnOpen = getHtmlStr(`
                <div class="x-spreadsheet-toolbar-btn" title="Загрузить шаблон">
                    <div class="bi-folder2-open" style="font-size: 1.3em; color: #4d4d4d"/>
                </div>
            `);
            const btnSave = getHtmlStr(`
                <div class="x-spreadsheet-toolbar-btn zoom-out-container" title="Сохранить шаблон">
                    <div class="bi-floppy2-fill" style="font-size: 1.2em; color: #4d4d4d"/>
                </div>
            `);

            // @ts-ignore
            refSave.current = btnSave[0].children[0];

            btnNew[0].addEventListener('click', async (e) => {
                clbConfirm = () =>
                    s.loadData([{
                        "name": "Шаблон1",
                        "freeze": "A1",
                        "styles": [],
                        "merges": [],
                        "rows": {"len": 100},
                        "cols": {"len": 26},
                        "validations": [],
                        "autofilter": {}
                    }])
                setShowConfirm(true);

            });

            btnOpen[0].addEventListener('click', async (e) => {
                const arrayBuffer = await openFileDialog('xlsx');
                let sheet = await convertExcelToXSpreadsheet({arrayBuffer});
                const _sheet = fillWidthToColumns(sheet)
                setDoc(_sheet);
                didInit = false;
            });
            btnSave[0].addEventListener('click', () => save(s));

            // @ts-ignore
            let nodeToolBtn = refNodeSheet.current.querySelector('.x-spreadsheet-toolbar-btns');
            nodeToolBtn.prepend(btnNew[0], btnOpen[0], btnSave[0]);

        }, 100)

        // @ts-ignore
        s.validate()

        // @ts-ignore
        window.spreadsheet = s;

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!spreadsheet || !Boolean(doc)) return;
        const _doc = fillWidthToColumnsExt(doc);
        properties = _doc.map(it => it.properties);

        if (!didInit) spreadsheet.loadData(_doc) // load doc
        didInit = true;
    }, [doc]);

    const save = (s: Spreadsheet) => {
        // @ts-ignore
        refSave.current.classList.add(classAnim)
        let _doc = s.getData();
        let __doc = fillWidthToColumnsContract(_doc);
        __doc = addProperties(__doc);
        setDoc(__doc);
        console.log('store doc')
        // @ts-ignore
        setTimeout(() => refSave.current.classList.remove(classAnim), 1000);

        return s;
    };

    const handleKeyDown = (e) => {
        const {ctrlKey, key}: KeyboardEvent = e;
        if (ctrlKey && key === 's') {
            e.preventDefault();
            setSpreadsheet(now => save(now));
        }
    };

    return <>
        <div ref={refNodeSheet}/>
        <Dialog title="Создать новый документ" message="Уверены?" show={showConfirm} setShow={setShowConfirm}
                onConfirm={async () => clbConfirm()}
                props={{className: 'modal-sm'}}/>
    </>;
}
//@ts-ignore
export default SheetReports;