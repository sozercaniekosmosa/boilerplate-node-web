import Spreadsheet from "x-data-spreadsheet"
import React, {useEffect, useRef, useState} from "react";
import ruRU from "./ru-RU.ts"
import {textToHtmlNodes} from "../../lib/dom.ts";
import convertExcelToXSpreadsheet from "./import.ts";
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
const classHead = 'header-set'
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

function createSpreadSheet(refNodeSheet: React.MutableRefObject<HTMLElement | null>, height: number) {
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

function getNameSheet(s: Spreadsheet) {
    // @ts-ignore
    const name = s.sheet.data.name;
    // @ts-ignore
    return s.datas.findIndex(it => it.name == name); //ищем шаблон
}

const SheetReports = ({doc, setDoc, height = 40}) => {

    const [spreadsheet, setSpreadsheet] = useState<Spreadsheet>()
    const refNodeSheet = useRef<HTMLElement | null | any>()
    const refSave = useRef<HTMLElement | null>()
    const refHeader = useRef<HTMLElement | null>()
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {

        Spreadsheet.locale('ru-RU', ruRU);

        // @ts-ignore
        if (refNodeSheet.current.innerHTML != '') return;

        const s = createSpreadSheet(refNodeSheet, height)
        setSpreadsheet(s); // необходимо привязать компонент к React-состоянию что бы иметь к нему доступ позже
        // s.loadData(doc) // load doc
        infLoop.call(this, s);

        // s.on('cells-selected', (cell, {sri, sci, eri, eci}) => {
        //     console.log(cell, sri, sci, eri, eci)
        // });

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
        properties = _doc.map(it => it?.properties ?? {});

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

    const setHeader = (s: Spreadsheet) => {

        // @ts-ignore
        const {sri, eri, sci, eci} = s.sheet.selector.range;
        console.log(sri, eri, sci, eci);

        // @ts-ignore
        const indexSheet = getNameSheet(s);
        if (properties[indexSheet]?.pinHeader) {
            delete properties[indexSheet].pinHeader;
        } else {
            properties[indexSheet].pinHeader = [sri, eri];
        }

        save(s);

        // spreadsheet.sheet.selector.reset()
        // spreadsheet.sheet.selector.set(4,0,true)
        // spreadsheet.sheet.selector.setEnd(4,2,true)

        return s;
    };

    const infLoop = (s: Spreadsheet) => {

        const indexSheet = getNameSheet(s);

        if (!refNodeSheet.current?.querySelector('.mark-btn-added')) {

            //language=html
            const btn: ChildNode[] = textToHtmlNodes(`
                <div class="x-spreadsheet-toolbar-btn mark-btn-added" title="Новый документ">
                    <div class="bi-file-earmark" style="font-size: 1.3em; color: #4d4d4d"></div>
                </div>
                <div class="x-spreadsheet-toolbar-btn" title="Загрузить шаблон">
                    <div class="bi-folder2-open" style="font-size: 1.3em; color: #4d4d4d"></div>
                </div>
                <div class="x-spreadsheet-toolbar-btn zoom-out-container" title="Сохранить шаблон">
                    <div class="bi-floppy2-fill" style="font-size: 1.2em; color: #4d4d4d"></div>
                </div>
                <div class="x-spreadsheet-toolbar-btn" title="Фиксировать строки">
                    <div class="bi-file-earmark-break" style="font-size: 1.3em; color: #4d4d4d"></div>
                </div>
            `);

            refSave.current = (btn[2] as HTMLElement).children[0] as HTMLElement;
            refHeader.current = (btn[3] as HTMLElement).children[0] as HTMLElement;

            btn[0].addEventListener('click', async (e) => {
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

            btn[1].addEventListener('click', async (e) => {
                const arrayBuffer = await openFileDialog('xlsx');
                let sheet = await convertExcelToXSpreadsheet({arrayBuffer});
                const _sheet = fillWidthToColumns(sheet)
                setDoc(_sheet);
                didInit = false;
            });
            btn[2].addEventListener('click', () => save(s));
            btn[3].addEventListener('click', () => setHeader(s));

            // @ts-ignore
            let nodeToolBtn = refNodeSheet.current.querySelector('.x-spreadsheet-toolbar-btns');
            nodeToolBtn.prepend(...btn);
        }

        if (properties[indexSheet]?.pinHeader) {
            refHeader.current.classList.add(classHead)
        } else {
            refHeader.current.classList.remove(classHead)
        }


        setTimeout(() => infLoop(s), 1000);
    }


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

export default SheetReports;