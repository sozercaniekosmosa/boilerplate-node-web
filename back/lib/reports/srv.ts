import {createWebServer} from "../services/webServer/WebServer";
import express from "express";


export const createServiceReport = (port) => {
    const {app: app2} = createWebServer(port);
    const router = express.Router();
    app2.use('/', router);
    router.get('/list', async (req, res) => {
        try {
            //TODO: вставте сюда свой код
            res.send([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14]]);
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send({error: error?.message || error},);
        }
    });
    router.get('/sum', async (req, res) => {
        try {
            //TODO: вставте сюда свой код
            res.send([[321]]);
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send({error: error?.message || error},);
        }
    });
}