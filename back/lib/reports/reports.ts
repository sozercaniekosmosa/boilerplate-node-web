import axios from "axios";
import {exportToExcel} from "./export";
import fillData from "./fillData";
import vm from "node:vm";

const exec = (strCode: string) => {

// Функции, которые будут доступны программе А
    const externalFunctions = {
        externalFunction: () => {
            return 'external';
        }
    };

    const context = vm.createContext({...externalFunctions});// Создаем изолированный контекст

// Выполняем код программы А в изолированном контексте
    vm.runInContext(strCode, context);

    /*// Теперь функции программы А доступны в контексте
        console.log(context.foo()); // Вывод: foo
        console.log(context.bar()); // Вывод: external and bar
        console.log(context.baz()); // Вывод: foo and baz

    // Вызов функций программы А из внешнего кода
        function callFunctionFromA(funcName, ...args) {
            if (typeof context[funcName] === 'function') {
                return context[funcName](...args);
            } else {
                throw new Error(`Function ${funcName} is not defined in context A`);
            }
        }*/

    return context;
}

export const reports = async (sheetData: TArraySheet, strCode: string, path, pathTemplate?) => {

    // const fn = await import('./fn');
    const fn = exec(strCode);

    const sd = await fillData(sheetData, async (cmd: string, name: string) => {
        let arr: any[] | undefined;
        if (cmd === 'srv') {
            const {data} = await axios.get(`http://localhost:${3001}/${name}`);
            arr = data;
        } else if (cmd === 'fn') {
            arr = await fn[name]();
        }
        return arr;
    })
    await exportToExcel(sd as TArraySheet, path);
}
