import {getCodeParam, sanitizeNoSQLInjection} from "../utils";
import vm from "node:vm";
import pg from "pg";
import {fileURLToPath} from "url";
import {dirname} from "path";
import {config} from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = config({override: true, path: __dirname + '\\.env'});
const {USER, HOST, DATABASE, PASSWORD, DB_PORT} = env.parsed

interface TExecVMJS {
    strCode: string;
    param: any;//{ [key: string]: [string] };
    listExternalFunctions: { [key: string]: (any) => any };
}

export const execVMJS = ({strCode, param, listExternalFunctions}: TExecVMJS) => {

    let listParVal = prepareParam(param, strCode);

    const context = vm.createContext({...listExternalFunctions, SQL});// Создаем изолированный контекст

    vm.runInContext(strCode, context); // Выполняем код в изолированном контексте

    function callFunction(funcName, args) {
        if (typeof context[funcName] === 'function') {
            return context[funcName](...args);
        } else {
            throw new Error(`Function ${funcName} is not defined in context`);
        }
    }

    return (name: string) => {
        return callFunction(name, listParVal[name])
        // return callFunction(name)
    };
}

function prepareParam<ReqQuery>(query: ReqQuery, strCode) {
    const listPar = {};
    //Да, два раза. Лучше одной дезинфекции может быть только две!
    Object.entries(query).forEach(([key, val]) => listPar[key] = sanitizeNoSQLInjection(sanitizeNoSQLInjection(val)));
    console.log(listPar);
    let listParVal = {};
    const arrFn = getCodeParam(strCode)
    for (let i = 0; i < arrFn.length; i++) {
        const [nameFn, param] = arrFn[i];
        const arrParam = param ? param.replace(/\s/g, '').split(',') : [];
        listParVal[nameFn] = arrParam.map(namePar => listPar[namePar]);
    }
    return listParVal;
}

async function SQL(query: string) {
    const {Client} = pg;
    const client = new Client({user: USER, host: HOST, database: DATABASE, password: PASSWORD, port: +DB_PORT,});

    await client.connect();

    // `SELECT "reportDate", sumvol, summas, dens, densbik, temp, tempbik, press, pressbik FROM public."SIKNreports"`
    // `SELECT "recordNumber", "recordDate", "reportDate", "reportType", volline1, masline1, volline2, masline2, volline3, masline3, sumvol, summas, dens, densbik, volday, masday, temp, tempbik, press, pressbik, ratebik, maswithoutwater, watervol, massnetto, "reportNumber" FROM public."SIKNreports"`
    const queryResult = await client.query(query);

    // console.log(queryResult.rows);
    const arr = queryResult.rows;
    await client.end();

    return arr;
}