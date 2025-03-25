import axios from "axios";
import {exportToExcel} from "./export";
import fillData from "./fillData";

export const reports = async (sheetData: TArraySheet, path, pathTemplate?) => {

    const fn = await import('./fn');

    const sd = await fillData(sheetData, async (cmd: string, name: string) => {
        let arrDataReceived: any[] | undefined;
        if (cmd === 'srv') {
            const {data} = await axios.get(`http://localhost:${3001}/${name}`);
            arrDataReceived = data;
        } else if (cmd === 'fn') {
            arrDataReceived = await fn[name]();
        }
        return arrDataReceived;
    })
    await exportToExcel(sd as TArraySheet, path);
}
