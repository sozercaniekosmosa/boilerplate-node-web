import {execFile} from "child_process";
import express from "express";
import axios from "axios";
import {isAllowHostPort} from "../../webUtils";
import {removeFile, saveTextToFile} from "../../../filesystem";
import {noSQL} from "../../../db/noSQL";

const routerReport = express.Router();

// function fillWidthToColumns(arrData, kWidth = 7) {
//     // @ts-ignore
//     return arrData.map(data => { //приведение ширины столбцов
//         // @ts-ignore
//         data.cols = Object.fromEntries(Object.entries(data.cols).map(([key, val]) => key != 'len' ? [key - 1, {width: val.width * kWidth}] : [key, val]))
//         return data;
//     })
// }

routerReport.post('/store', async (req, res) => {
    try {
        const {body: {doc}} = req;
        const db = global.db as noSQL;
        db.update({id: 'doc', doc})
        console.log(doc)

        res.send('ok');
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});

routerReport.get('/doc', async (req, res) => {
    try {
        const db = global.db as noSQL;
        let doc = db.getByID('doc');
        res.send(doc);
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});


export default routerReport;