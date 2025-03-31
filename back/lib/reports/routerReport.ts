import express from "express";
import {noSQL} from "../db/noSQL";
import glob from "../../../front/src/glob";
import {reports} from "./reports";
import {config} from "dotenv";
import {createAndCheckDir} from "../filesystem";
import {fileURLToPath} from "url";
import {dirname} from "path";
import {formatDateTime} from "../time";
import {getCodeParam, sanitizeNoSQLInjection} from "../utils";
import vm from "node:vm";
import {Query} from "express-serve-static-core";
import {execVMJS} from "./scriptsHandler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = config({override: true, path: __dirname + '\\.env'});
const {REPORT_DIR} = env.parsed

const routerReport = express.Router();

routerReport.post('/doc', async (req, res) => {
    try {
        const {body: {doc}} = req;
        const db = glob.db as noSQL;
        db.update({doc: doc})
        console.log(doc)

        res.send('ok');
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});

routerReport.get('/doc', async (req, res) => {
    try {
        const db = glob.db as noSQL;
        let doc = db.getByID('doc');
        res.send(doc);
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});

routerReport.post('/code', async (req, res) => {
    try {
        const {body: {code}} = req;
        const db = glob.db as noSQL;
        db.update({code: code})
        console.log(code)

        res.send('ok');
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});

routerReport.get('/code', async (req, res) => {
    try {
        const db = glob.db as noSQL;
        let code = db.getByID('code');
        res.send(code);
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});

// http://localhost:5173/api/v1/report-excel/day?ololo=1
routerReport.get('/report-excel/:name', async (req, res) => {
    try {
        const query: Query = req.query

        const name = req.params.name;
        let path: string = `${REPORT_DIR}/`;
        path += (query?.fileName ? query.fileName : formatDateTime(new Date(), 'yyyy-MM-dd-hh-mm-ss-' + name)) + '.xlsx';

        const db = glob.db as noSQL;
        const arrSheet = structuredClone(db.getByID('doc'));
        const strCode = db.getByID('code');
        const sheet = [arrSheet.find(it => it.name == name)] as TArraySheet; //ищем шаблон
        !sheet[0] && global.ERR("Отчет с таким именем не найден");

        await createAndCheckDir(REPORT_DIR);

        const exec = execVMJS({strCode, param: query, listExternalFunctions: {fn: () => 'ololo'}});

        await reports({sheetData: sheet, clbGetData: exec, path});

        global.OK(`Отчет "${path}" успешно сформирован`);
        res.send('ok');
    } catch (error) {
        global.ERR(error.message);
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});

export default routerReport;