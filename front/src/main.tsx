import {createRoot} from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import Index from './components/index.tsx'
import global from "./global.ts";
import React from "react";
import {ERR, OK} from "./components/PopupMessage/PopupMessage.tsx";
import {webSocket} from "./lib/services.ts";
import {eventBus} from "./lib/events.ts";

global.host = 'http://localhost:5173/'
global.hostAPI = 'http://localhost:5173/api/v1/'
global.wsHost = 'localhost'
global.wsPort = '3000'

let nodeRoot = document.getElementById('root');
createRoot(nodeRoot!).render(
    // <StrictMode>
    <Index/>
    // </StrictMode>,
)

nodeRoot.addEventListener('dblclick', () => {
    global.selectedText = undefined;
})
nodeRoot.addEventListener('mouseup', () => {
    const text = window.getSelection().toString()
    global.selectedText = text.length ? text.trim() : null;
    // console.log(text)
})

//веб-сокет для обмена данными с сервером
async function createMessageSocket() {
    try {
        webSocket({
            host: global.wsHost, port: global.wsPort, timeReconnect: 1500,
            clbOpen: () => {
                eventBus.dispatchEvent('connect-to-srv');
                OK('Связь с сервером восстановлена')
            },
            clbMessage: ({data: mess}) => {
                // console.log("Получены данные: " + mess);
                const {type, data} = JSON.parse(mess);
                eventBus.dispatchEvent('message-socket', {type, data})
            },
            clbError: () => ERR('Нет связи с сервером')
        })
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        // setTimeout(() => messageSocket(nui), 2000);
    }
}

await createMessageSocket();