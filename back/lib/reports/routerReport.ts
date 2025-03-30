import express from "express";
import {noSQL} from "../db/noSQL";
import glob from "../../../front/src/glob";
import {reports} from "./reports";
import path from "path";

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
        const name = req.params.name;

        console.log(name, req.query);
        const db = glob.db as noSQL;
        const arrSheet = structuredClone(db.getByID('doc'));
        const code = db.getByID('code');
        const sheet = [arrSheet.find(it => it.name == name)] as TArraySheet;
        if (!sheet[0])
            global.ERR("Отчет с таким именем не найден")
        await reports(sheet, code, path.join(glob.root, '../tmp/tst.xlsx'))

        res.send('ok');
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});

export default routerReport;