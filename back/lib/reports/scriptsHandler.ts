import {getCodeParam, sanitizeNoSQLInjection} from "../utils";
import vm from "node:vm";
import pg from "pg";
import {fileURLToPath} from "url";
import {dirname} from "path";
import {config} from "dotenv";

interface TExecVMJS {
    strCode: string;
    param: any;//{ [key: string]: [string] };
    listExternalFunctions: { [key: string]: (any) => any };
}

export const execVMJS = ({strCode, param, listExternalFunctions}: TExecVMJS) => {

    let listParVal = prepareParam(param, strCode);

    const context = vm.createContext({...listExternalFunctions});// Создаем изолированный контекст

    vm.runInContext(strCode, context); // Выполняем код в изолированном контексте

    function callFunction(funcName, args) {
        if (typeof context[funcName] === 'function') {
            return context[funcName](...args);
        } else {
            throw new Error(`Function ${funcName} is not defined in context`);
        }
    }

    return (name: string) => callFunction(name, listParVal[name]);
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