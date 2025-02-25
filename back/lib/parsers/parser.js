import {getHashCyrb53, removeFragmentsFromUrl} from "../utils.js";
import {getPathSourceNews, NewsUpdater} from "../../parser.js";

export class Parser {
    _listCompare = new Set();
    MIN_WORDS_TOPIC = 200;
    counter = 0;
    max = 1;
    HOST;
    getArrUrlOfType = () => console.error('not init getArrUrlOfType method');
    getDateAsMls = () => console.error('not init getDateAsMls method');
    getTitle = () => console.error('not init getTitle method');
    getArrTags = () => console.error('not init getArrTags method');
    getTextContent = () => console.error('not init getTextContent method');
    getHtmlUrl = () => {
        console.error('not init getHtmlUrl method');
        return null
    };
    getDocument = () => {
        console.error('not init getDocument method');
        return null
    };
    getSrcName = () => {
        console.error('not init getSrcName method');
        return null
    };
    getID = () => {
        console.error('not init getID method');
        return null
    };
    isExistID = (id) => {
        console.error('not init isExistID method');
        return null
    };
    onStoreToDB = (id, data) => {
        console.error('not init onStoreToDB method');
        return null
    };
    listTask;

    constructor({
                    host,
                    listTask,
                    getArrUrlOfType,
                    getDateAsMls,
                    getTitle,
                    getArrTags,
                    getTextContent,
                    getHtmlUrl,
                    getDocument,
                    getSrcName,
                    getID,
                    isExistID,
                    onStoreToDB
                }) {
        this.HOST = host;
        this.getArrUrlOfType = getArrUrlOfType;
        this.getDateAsMls = getDateAsMls;
        this.getTitle = getTitle;
        this.getArrTags = getArrTags;
        this.getTextContent = getTextContent;
        this.listTask = listTask;
        this.getHtmlUrl = getHtmlUrl;
        this.getDocument = getDocument;
        this.getSrcName = getSrcName;
        this.getID = getID;
        this.isExistID = isExistID;
        this.onStoreToDB = onStoreToDB;
    }

    async updateByType(typeNews) {
        this._listCompare = new Set();
        this.counter = 0;

        try {
            const arrTask = Object.entries(typeNews.length ? {[typeNews]: this.listTask[typeNews]} : this.listTask);
            const promiseArrUrl = arrTask.map(([type, url]) => this.getArrUrlOfType(type, this.HOST + url));
            let arrListUrl = await Promise.allSettled(promiseArrUrl);
            arrListUrl = arrListUrl.map(it => it.value)

            const _DEBUG_ = false;
            let promises = [];

            for (let i = 0; i < arrListUrl.length; i++) {
                let it = arrListUrl[i];
                if (!it) {
                    console.error(`Индекс с ошибкой ${i}`);
                    continue;
                }
                const {type, arrUrl} = it;
                this.max += arrUrl.length;
                for (let i = 0; i < arrUrl.length; i++) {
                    const url = arrUrl[i];
                    let promiseFetchData = this.#fetchData({type, url, host: this.HOST});
                    if (_DEBUG_) await promiseFetchData; else promises.push(promiseFetchData);
                }
            }

            if (!_DEBUG_) await Promise.allSettled(promises);

        } catch (e) {
            console.error(e);
        } finally {
            this.counter = -1;
            if (global.messageSocket) (global.messageSocket).send({type: 'progress', data: -1})
        }
    }

    async #fetchData({type, url, host}) {
        try {
            if (url.startsWith('/')) url = host + url;
            if (!url.startsWith(host)) return;

            url = removeFragmentsFromUrl(url);

            const id = this.getID(url);

            const isExist = await this.isExistID(id);
            if (isExist) {
                console.error(url, type);
                return null;
            }

            let html = await this.getHtmlUrl(url);
            html = html.replaceAll(/\u00A0/g, ' ');

            const doc = await this.getDocument(html);

            const title = this.getTitle(doc);
            if (!title || !title.length) return null;

            const tags = this.getArrTags(doc);
            if (!tags || !tags.length) return null;

            const date = this.getDateAsMls(doc);
            if (!date) return null;

            let text = this.getTextContent(doc);
            if (!text || !text.length || text.length < this.MIN_WORDS_TOPIC) return null;

            let from = this.getSrcName(doc) ?? '';

            let data = {date, url, type, from, title, text,};

            this.onStoreToDB(id, data);
        } catch (e) {
            console.log(e, url);
        } finally {
            this.counter++;
            if (global.messageSocket) (global.messageSocket).send({
                type: 'progress', data: this.counter / this.max * 100
            })
        }
        return null;
    }
}

// new Parser({host: 'https://dzen.ru/news', short: 'DZ', ...dzen})