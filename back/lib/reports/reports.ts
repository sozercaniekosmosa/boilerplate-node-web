import axios from "axios";
import {exportToExcel} from "./export";
import fillData from "./fillData";
import vm from "node:vm";
import {jsonToHtmlTable} from "./jsonToTable";
import {chromium} from "playwright";


interface TReportsParam {
    sheetData: TArraySheet;
    clbGetData: (fnName: string) => any;
    paramVal?: any;
    path: string;
    type: 'pdf' | 'excel'
}

/**
 * Формирование отчета
 * @param sheetData - объект массив таблиц для отчета
 * @param clbGetData(fnName) - выпольнить функцию (fnName) и получить значения для отчета
 * @param path - путь выходного файла
 */
export const reports = async ({sheetData, clbGetData, path, type}: TReportsParam) => {

    const sd = await fillData(sheetData, async (cmd: string, name: string) => {
        let arr: any[] | undefined;
        if (cmd === 'srv') {
            const {data} = await axios.get(`http://localhost:${3001}/${name}`);
            arr = data;
        } else if (cmd === 'fn') {
            arr = await clbGetData(name);
        }
        return arr;
    })
    if (type == "excel") {
        await exportToExcel(sd as TArraySheet, path);
    } else if (type == "pdf") {

        // console.log(JSON.stringify(sd[0]));
        const table = jsonToHtmlTable(sd[0]);
        await generatePDFfromHTML(table, path)
    }
}

async function generatePDFfromHTML(htmlContent, outputPath) {
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({
        path: outputPath, format: 'A4', landscape: true,
        margin: {
            left: '5px',
            top: '5px',
            bottom: '5px',
            right: '5px'
        }
    });
    // console.log('PDF успешно создан:', outputPath);
    await browser.close();
}