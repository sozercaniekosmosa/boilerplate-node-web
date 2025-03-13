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
// await exportToExcel('../tmp/tst.xlsx');

const wasmBuffer = fs.readFileSync('../tmp/tst.wasm');

// @ts-ignore
const wasmModule = await WebAssembly.instantiate(wasmBuffer)

const exports = wasmModule.instance.exports;
const sum = exports.add(5, 6);
console.log(sum); // Outputs: 11