import {execFile} from "child_process";
import express from "express";
import axios from "axios";
import {isAllowHostPort} from "../../webUtils";
import {removeFile, saveTextToFile} from "../../../filesystem";
import glob from "../../../../../front/src/glob";

const routerGeneral = express.Router();

routerGeneral.post('/open-dir', async (req, res) => {

    try {
        const {body: {path}} = req;
        // @ts-ignore
        execFile('explorer.exe', [path], {stdio: 'ignore'});

        res.send('ok');
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }


});
routerGeneral.post('/save-text', async (req, res) => {
    try {
        const {body: {path, data}} = req;
        await saveTextToFile(path, data)
        res.status(200).send('ok');
    } catch (error) {
        res.status(error.status || 500).send({error: error?.message || error},);
    }
})

routerGeneral.get('/remove-file', async (req, res) => {
    try {
        const {path} = req.query;
        await removeFile(path)
        res.status(200).send('ok')
    } catch (error) {
        res.status(error.status || 500).send({error: error?.message || error},);
    } finally {
        // @ts-ignore
        glob?.messageSocket && glob.messageSocket.send({type: 'update-news'})
    }
})

routerGeneral.get('/exist-endpoint', async (req, res) => {
    try {
        const {url} = req.query;
        const response = await axios.head(url as string);
        if (response.status === 200) res.status(200).send('Ok')
    } catch (error) {
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});

routerGeneral.get('/is-allow-host-port/:host/:port', async (req, res) => {

    const {host, port} = req.params;
    try {
        let isUse = await isAllowHostPort(host, port);
        res.send(isUse);
    } catch (error) {
        res.status(error?.status || 500).send({error: error?.message || error});
    }
});

export default routerGeneral;