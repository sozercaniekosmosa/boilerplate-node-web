import express from "express";
import path from "path";
import bodyParser from "body-parser";
import {WEBSocket} from "./WebSocket";

export function createWebServer(port, webDir, clbWebSocket): { app: any, ws: any } | null {
    const app = express();

    app.use(express.static(webDir)); // путь к web-страницам

    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.raw());
    app.use(bodyParser.text({limit: '50mb'}));
// app.use(express.raw({ type: 'application/octet-stream' }));

    console.log(port)
    const webServ = app.listen(port, () => {
        console.log(`API is listening on port ${port}`);
    });

    app.get('/', (req, res) => {// путь к корневой директории
        res.sendFile(path.join(webDir, 'index.html'));
    })

    app.use((req, res, next) => {
        res.status(404).send('Запрошеный ресурс не найден!');
    });

    const ws = new WEBSocket(webServ, {
        clbAddConnection: async ({ws, arrActiveConnection}) => {
            clbWebSocket({type: 'connection', ws, arrActiveConnection})
        }, clbMessage: ({ws, arrActiveConnection, mess, host}) => {
            clbWebSocket({type: 'message', ws, arrActiveConnection, mess, host})
        }, clbClose: async ({ws, arrActiveConnection}) => {
            clbWebSocket({type: 'close', ws, arrActiveConnection})

        }
    })

    global["LOG"] = (mess) => ws.send({type: 'popup-message', data: mess});
    global["ERR"] = (mess) => ws.send({type: 'popup-message-err', data: mess});
    global["WARN"] = (mess) => ws.send({type: 'popup-message-warn', data: mess});
    global["OK"] = (mess) => ws.send({type: 'popup-message-ok', data: mess});

    return {app, ws}
}

//пример использования
// const {app, ws} = await createWebServer(3000, './', ({type, ws, arrActiveConnection, mess, host}) => {
//     console.log('ws:', type)
// });


// CREATING ROUTES
// const router = express.Router();
// const router2 = express.Router();

// !!! ATTENTION !!! full_url = '/api/v1' + '/some-route' see below =>
// app.use('/api/v1', routerGeneral);
// app.use('/api/v1', router);
// app.use('/api/v1', router2);

//добавлем end-points:
// router.get('/some-route1', async (req, res) => { // добавлем end-points GET "some-route1"
//     try {
//         const {id, value, data} = req.query;  //getting GET params
//         // insert your code here ...
//         res.send(folderPath);
//     } catch (error) {
//         console.log(error)
//         res.status(error.status || 500).send({error: error?.message || error},);
//     }
// });
//
// router.post('/some-route2', async (req, res) => { // добавлем end-points POST "some-route2"
//     try {
//         const {body: {id, value, data}} = req; //getting POST params
//         // insert your code here ...
//         res.send('ok');
//     } catch (error) {
//         console.log(error)
//         res.status(error.status || 500).send({error: error?.message || error},);
//     }
// });
//
// router2.post('/some-route3', async (req, res) => { // добавлем end-points POST "some-route2"
//     try {
//         const {body: {id, value, data}} = req; //getting POST params
//         // insert your code here ...
//         res.send('ok');
//     } catch (error) {
//         console.log(error)
//         res.status(error.status || 500).send({error: error?.message || error},);
//     }
// });