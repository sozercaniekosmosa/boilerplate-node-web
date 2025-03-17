import {fileURLToPath} from 'url';
import path, {dirname} from 'path';
import {config} from "dotenv";
import {noSQL} from "./lib/db/noSQL";
import {createWebServer} from "./lib/services/webServer/WebServer.js";
import routerGeneral from "./lib/services/webServer/api-v1/general";
import {CalcDensity} from "../assemblyScript/build/debug.js"
import {exp, exportToExcel} from "./lib/reports/exportToExcel";
// import fn from "./lib/reports/fn";

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
                1: {text: ""},
                2: {text: ""},
                3: {text: ""},
                4: {text: ""},
                5: {text: ""},
                6: {text: ""},
                7: {text: ""},
                8: {text: ""},
                9: {text: ""},
                10: {text: ""},
                11: {text: ""},
                12: {text: ""},
                13: {text: ""},
                14: {text: ""},
                15: {text: ""}
            }
        },
        len: 100
    },
    cols: {len: 26},
    validations: [],
    autofilter: {}
}
await exp(sheetData)
await exportToExcel(sheetData, '../tmp/tst.xlsx');
// @ts-ignore
// import fn from './lib/reports/fn'
// console.log(fn.list());

// import pg from "pg";
// const Client = pg.Client;
// const client = new Client({
//     host: '192.168.10.149', // Адрес сервера базы данных
//     user: 'scadabd', // Имя пользователя
//     password: 'Asutp05k.,jqAsutp05k.,jqA', // Пароль
//     database: 'SIKN_XOLM', // Название базы данных
//     port: 5432, // Порт (по умолчанию для PostgreSQL)
// });
//
// await client.connect()
//
// const queryResult = await client.query(
//     // `SELECT "reportDate", sumvol, summas, dens, densbik, temp, tempbik, press, pressbik FROM public."SIKNreports"`
//     `SELECT "recordNumber", "recordDate", "reportDate", "reportType", volline1, masline1, volline2, masline2, volline3, masline3, sumvol, summas, dens, densbik, volday, masday, temp, tempbik, press, pressbik, ratebik, maswithoutwater, watervol, massnetto, "reportNumber" FROM public."SIKNreports"`
// );
// console.log(queryResult.rows);

console.log('ok')

//ПЕРЕСЧЕТ ПЛОТНОСТИ НЕФТИ И НЕФТЕПРОДУКТОВ ИЗ ОДНИХ ПАРАМЕТРОВ СРЕДЫ В ДРУГИЕ ПО Р 50.2.076-2010
//double t - температура, к которой нужно пересчитать плотность
//double p - давление, к которой нужно пересчитать плотность
//double measuredT - измеренная температура
//double measuredP - измеренное давление
//double measuredD - измеренная плотность
//byte productType - тип продукта (0 - нефть, 1 - нефтепродукты)
//export function CalcDensity(t: f64, p: f64, measuredT: f64, measuredP: f64, measuredD: f64, productType: u8): f64 {
// console.log(CalcDensity(16.32, 1.28, 27.3, 2.45, 836.15, 0)); // Outputs: 11