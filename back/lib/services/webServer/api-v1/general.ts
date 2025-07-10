import {execFile} from "child_process";
import express from "express";
import axios from "axios";
import {isAllowHostPort} from "../../webUtils";
import {removeFile, saveTextToFile} from "../../../filesystem";
import glob from "../../../../../front/src/glob";
import {bothubGPT, mistralGPT} from "../../../lm/ai";
import {config} from "dotenv";

const {parsed: {FOLDER_ID, OAUTH_TOKEN, ARLIAI_API_KEY, MISTRAL_API_KEY}} = config();

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

routerGeneral.post('/gpt', async (req, res) => {
    const {body: {id, type, text, prompt}} = req;
    let textGPT = '';
    try {
        // textGPT = '[{"i":0,"desc":"имя, Ф.И.О., прозвища, ...","value":"Сергей Иванович Кузнецов, прозвище \'Тень\'"},{"i":1,"desc":"Средний, пожилой, молодой","value":"Средний"},{"i":2,"desc":"Цели и мотвация","value":"Раскрытие сложных преступлений, поиск справедливости и правды"},{"i":3,"desc":"Социальный статус, проблемы, ...","value":"Частный детектив, финансовые трудности, проблемы с алкоголем"},{"i":4,"desc":"Уже имеет или получил: предметы, умения, информация","value":"Умение вести расследование, знание уличных правил, контакты в криминальном мире"},{"i":5,"desc":"История жизни в прошлом","value":"Бывший полицейский, ушел из-за конфликта с начальством, развод с женой"},{"i":6,"desc":"Отношения: друзья, семья, знакомые, коллеги","value":"Близкий друг детства, напряженные отношения с бывшей женой, коллеги по цеху"},{"i":7,"desc":"Интеллектуальные и творческие способности","value":"Аналитическое мышление, способность к дедукции, навыки наблюдения"},{"i":8,"desc":"Скрытые цели и мотвация","value":"Мечта о восстановлении справедливости и порядка, желание вернуть уважение бывшей жены"},{"i":9,"desc":"Моральные/аморальные  аспекты личности","value":"Склонен к нарушению закона ради достижения цели, но при этом придерживается собственного кодекса чести"},{"i":10,"desc":"Пол","value":"Мужской"},{"i":11,"desc":"Рост персонажа (сантиметры, высокий, низкий, и т.д. )","value":"185 см, высокий"},{"i":12,"desc":"Телосложение","value":"Атлетическое"},{"i":13,"desc":"Цвет волос","value":"Темно-каштановые"},{"i":14,"desc":"Цвет глаз","value":"Зеленые"},{"i":15,"desc":"Причёска/стрижка","value":"Короткая стрижка"},{"i":16,"desc":"Длина волос","value":"Короткие"},{"i":17,"desc":"Близко посаженные глаза, выдющийся подбородок и т.д.","value":"Выдающийся подбородок, шрам на левой щеке"},{"i":18,"desc":"Осанка","value":"Прямая, уверенная"},{"i":19,"desc":"Шрамы и травмы","value":"Шрам на левой щеке, огнестрельное ранение в плечо"},{"i":20,"desc":"Татуирвоки","value":"Татуировка в виде орла на правом плече"},{"i":21,"desc":"Тембр голоса","value":"Низкий, хриплый"},{"i":22,"desc":"Скорость речи","value":"Средняя, иногда замедленная при глубоких размышлениях"},{"i":23,"desc":"Предметы одежды: штаны, рубашка","value":"Джинсы, черная рубашка"},{"i":24,"desc":"Состояние одежды","value":"Поношенная, но аккуратная"},{"i":25,"desc":"Стиль одежды","value":"Классический, с элементами небрежности"},{"i":26,"desc":"Аксессуары","value":"Кожаный браслет на левой руке, серебряный крестик на шее"},{"i":27,"desc":"Привычки, типичные жесты, и т.д.","value":"Потирает подбородок при размышлениях, часто поправляет воротник рубашки"},{"i":28,"desc":"Тип темперамента:\\nСангвиник — энергичный, общительный, оптимистичный, быстро реагирует на события, легко переключается между делами, но может быть легкомысленным.\\nХолерик — целеустремлённый, импульсивный, вспыльчивый, быстро возбуждается, склонен к лидерству, но иногда не сдержан.\\nФлегматик — спокойный, уравновешенный, медлительный, надёжен, устойчив к стрессам, но может быть инертным и сухим в общении.\\nМеланхолик — чувствительный, ранимый, склонен к переживаниям, замкнут, часто тревожен и пессимистичен.","value":"Флегматик"},{"i":29,"desc":"Склонность к сарказму","value":"Умеренная"},{"i":30,"desc":"Способность к сопереживанию (0-10)","value":"7"},{"i":31,"desc":"Список страхов","value":"Страх потерять близких, страх неудачи в расследовании"},{"i":32,"desc":"Влияние на других, способность мобилизовать и вести за собой","value":"Способен вдохновлять команду на действия, но иногда слишком самостоятелен"}]'
        // textGPT = await mistralGPT(prompt, text, MISTRAL_API_KEY);
        textGPT = await bothubGPT(prompt, text);

        res.status(200).send(textGPT);
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send({error: error?.message || error},);
    }
});

export default routerGeneral;