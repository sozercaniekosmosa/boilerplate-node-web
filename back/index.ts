import {fileURLToPath} from 'url';
import path, {dirname} from 'path';
import {config} from "dotenv";
import {noSQL} from "./lib/db/noSQL";
import {createWebServer} from "./lib/services/webServer/WebServer.js";
import routerGeneral from "./lib/services/webServer/api-v1/general";
import {exportToExcel} from "./lib/reports/exp";
import fs from "fs";

// console.log(pg)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = config({override: true, path: '../.env'});
const {
    PORT,
    WEB_DIR,
} = env.parsed

const port = +process.env.PORT || +PORT;

global.root = __dirname;
global.port = port
global.webDir = path.join(__dirname, WEB_DIR);
global.db = new noSQL('..\\db\\db.json');

const {app} = createWebServer(3000, global.webDir, ({type, ws, arrActiveConnection, mess, host}) => {
    // console.log('ws:', type, ws, arrActiveConnection, mess, host)
});

app.use('/api/v1', routerGeneral);

console.log('OK')

// const q1 = "Реши уравнение 2x-8=15";
// console.log(chalk.yellow("User: ") + q1);
// await addTaskToLLM(q1, (type, chunk) => {
//     if (type != 'process') console.log(chalk.yellow(type));
//     process.stdout.write(chunk as string);
// })

// await createExcelReport('../tmp/SMCO.xlsx', '../tmp/tst.xlsx');

const sheetData = {
    name: "sheet2",
    freeze: "A1",
    styles: [
        {align: "center"}, {
            border: {
                bottom: ["thin", "#000"],
                top: ["thin", "#000"],
                left: ["thin", "#000"],
                right: ["thin", "#000"]
            }
        }, {
            align: "center",
            border: {bottom: ["thin", "#000"], top: ["thin", "#000"], left: ["thin", "#000"], right: ["thin", "#000"]}
        }, {
            border: {bottom: ["thin", "#000"], top: ["thin", "#000"], left: ["thin", "#000"], right: ["thin", "#000"]},
            font: {bold: true}
        }, {
            align: "center",
            border: {bottom: ["thin", "#000"], top: ["thin", "#000"], left: ["thin", "#000"], right: ["thin", "#000"]},
            valign: "middle"
        }, {align: "center", valign: "middle"}],
    merges: ["A1:C1", "A2:B2", "B3:C3", "A3:A5", "B4:C5"],
    rows: {
        0: {cells: {0: {merge: [0, 2], style: 4, text: "1"}, 1: {style: 5}, 2: {style: 5}}},
        1: {cells: {0: {merge: [0, 1], style: 4, text: "2"}, 1: {style: 5}, 2: {style: 4, text: "3"}}},
        2: {cells: {0: {merge: [2, 0], style: 4, text: "4"}, 1: {merge: [0, 1], style: 4, text: "5"}, 2: {style: 5}}},
        3: {cells: {0: {text: "4", style: 5}, 1: {merge: [1, 1], style: 4, text: "6"}, 2: {style: 5}}},
        4: {cells: {0: {style: 5}, 1: {style: 4}, 2: {style: 4}}},
        len: 100
    },
    cols: {len: 26},
    validations: [],
    autofilter: {}
}
await exportToExcel('../tmp/tst.xlsx', sheetData);

import {CalcDensity} from "../assemblyScript/build/debug.js"
//ПЕРЕСЧЕТ ПЛОТНОСТИ НЕФТИ И НЕФТЕПРОДУКТОВ ИЗ ОДНИХ ПАРАМЕТРОВ СРЕДЫ В ДРУГИЕ ПО Р 50.2.076-2010
//double t - температура, к которой нужно пересчитать плотность
//double p - давление, к которой нужно пересчитать плотность
//double measuredT - измеренная температура
//double measuredP - измеренное давление
//double measuredD - измеренная плотность
//byte productType - тип продукта (0 - нефть, 1 - нефтепродукты)
//export function CalcDensity(t: f64, p: f64, measuredT: f64, measuredP: f64, measuredD: f64, productType: u8): f64 {
console.log(CalcDensity(16.32, 1.28, 27.3, 2.45, 836.15, 0)); // Outputs: 11