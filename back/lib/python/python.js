import {loadPyodide} from "pyodide";

let pyodide;

async function evalPython(code) {
    try {
        !pyodide && (pyodide = await loadPyodide());
        return pyodide.runPython(code);
    } catch (e) {
        console.log(e)
    }
}