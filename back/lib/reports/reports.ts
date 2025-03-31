import axios from "axios";
import {exportToExcel} from "./export";
import fillData from "./fillData";
import vm from "node:vm";

interface TReportsParam {
    sheetData: TArraySheet;
    clbGetData: (fnName: string) => any;
    paramVal?: any;
    path: string;
}

/**
 * Формирование отчета
 * @param sheetData - объект массив таблиц для отчета
 * @param clbGetData(fnName) - выпольнить функцию (fnName) и получить значения для отчета
 * @param path - путь выходного файла
 */
export const reports = async ({sheetData, clbGetData, path}: TReportsParam) => {

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
    await exportToExcel(sd as TArraySheet, path);
}
