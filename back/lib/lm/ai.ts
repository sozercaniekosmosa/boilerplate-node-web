import axios from "axios";
import path from "path";
import {readFileAsync, writeFileAsync} from "../filesystem.js";
import OpenAI from "openai";
import {config} from "dotenv";

const {parsed: {FOLDER_ID, OAUTH_TOKEN, ARLIAI_API_KEY, MISTRAL_API_KEY, BOTHUB_API_KEY}} = config();

export async function yandexGPT(prompt, text, folder_id) {
    const iam_token = await getIAM();
    const url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';

    const promptData = {
        modelUri: `gpt://${folder_id}/yandexgpt/rc`,//
        completionOptions: {stream: false, "temperature": 0, "maxTokens": "15000"},
        messages: [{role: "system", "text": prompt ?? "Упрости текст до 30 слов"}, {role: "user", text}]
    }
    try {
        const {data} = await axios.post(url, promptData, {
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${iam_token}`},
            params: {folderId: folder_id},
        })

        return data.result.alternatives.map(({message: {text}}) => text).join('\n')
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function arliGPT(prompt, text, arliai_api_key) {
    try {
        const {data} = await axios.post("https://api.arliai.com/v1/chat/completions", {
            model: "Mistral-Nemo-12B-Instruct-2407",
            messages: [
                {role: "system", content: prompt},
                {role: "user", content: text}
            ]
            , repetition_penalty: 1.1, temperature: 0.7, top_p: 0.9, top_k: 40, max_tokens: 1024, stream: false
        }, {
            headers: {
                "Authorization": `Bearer ${arliai_api_key}`, "Content-Type": "application/json"
            }
        })
        return data.choices.map(({message: {content}}) => content).join('\n');
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function bothubGPT(prompt, text) {

    try {
        const openai = new OpenAI({
            apiKey: BOTHUB_API_KEY,
            baseURL: 'https://bothub.chat/api/v2/openai/v1'
        });

        // до 100
        const model = 'gemini-2.0-flash-001'//9s
        // const model = 'gpt-4.1-nano'//14s

        // model: 'deepseek-chat', //42s
        // model: 'grok-3-mini-beta',//19s
        // model: 'gpt-4o-mini',//27s
        // model: 'gpt-4.1-mini',//28s

        // >100
        // const model = 'o1-mini'//11s
        // const model = 'o3-mini'//41s
        // const model = 'o4-mini'//27s
        // const model = 'gpt-4.1'//21s
        // const model = 'gpt-4o-search-preview'//21s

        console.log(model);

        const response = await openai.chat.completions.create({
            model,
            messages: prompt && text ? [
                {role: "system", content: prompt},
                {role: "user", content: text}
            ] : [
                {role: "user", content: prompt ?? text}
            ],
            // temperature: 0.9,
            // response_format: {"type": "json_object"},
            stream: true
        });


        let result = '';
        for await (const chunk of response) {
            const part: string | null = chunk.choices[0].delta?.content ?? null;
            result += part;
        }

        // console.log(result);
        return result.startsWith('\`\`\`json') ? result.substring(7, result.length - 4) : result;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

export async function mistralGPT(prompt, text, mistral_api_key) {

    const url = 'https://api.mistral.ai/v1/chat/completions ';

    const data = {
        // model: 'mistral-large-latest',
        model: 'mistral-medium-2505',
        messages: prompt && text ? [
            {role: "system", content: prompt},
            {role: "user", content: text}
        ] : [
            {role: "user", content: prompt ?? text}
        ],
        response_format: {"type": "json_object"}
    };

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${mistral_api_key}`,
    };

    try {
        const response = await axios.post(url, data, {headers});
        console.log(response.data);

        return response.data.choices.map(({message: {content}}) => content).join('\n');

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}


export async function mistralGPT2(prompt, text, mistral_api_key) {
    try {
        const {data} = await axios.post('https://api.mistral.ai/v1/chat/completions', {
            model: 'mistral-large-latest',//'mistral-small-latest',
            messages: [
                {role: "system", content: prompt},
                {role: "user", content: text}
            ],
        }, {
            headers: {
                'Content-Type': 'application/json', 'Authorization': `Bearer ${mistral_api_key}`  // Замените на ваш API ключ
            }
        });

        return data.choices.map(({message: {content}}) => content).join('\n');
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function yandexToSpeech({text, path, voice = 'marina', speed = 1.4, folder_id, oauth_token}) {
    try {
        const iam_token = await getIAM(oauth_token);
        const url = 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize';

        const {data} = await axios({
            method: 'POST', url, headers: {
                'Authorization': `Bearer ${iam_token}`
            }, responseType: 'arraybuffer',  // Получаем данные как бинарный массив
            // @ts-ignore
            data: new URLSearchParams({
                text, lang: 'ru-RU', voice,
                //voice: 'jane', // voice: 'ermil',
                // voice: 'filipp',
                // voice: 'lera',
                speed, folderId: folder_id, format: 'mp3', sampleRateHertz: '48000'
            })
        })

        await writeFileAsync(`./public/public/${path}/speech.mp3`, data);
        console.log('Аудиофайл успешно создан.');
    } catch (error) {
        console.log(error)
        throw error;
    }
}

let iamToken, dtExpMs;
const getIAM = async (oauth_token = null) => { //для работы нужен AIM для его получения нужен OAUTH его можно взять тут: https://oauth.yandex.ru/verification_code
    let expiresAt, dtNowMs = (new Date()).getTime();
    const filePath = path.join('./', 'iam.json');

    if (dtExpMs && dtExpMs > dtNowMs) return iamToken; //dtExpMs-заиничен и время не истекло, то выход

    if (!dtExpMs) {//dtExpMs - не заиничен
        try {
            const raw = await readFileAsync(filePath);
            ({iamToken, expiresAt} = JSON.parse(raw.toString()));
            dtExpMs = (new Date(expiresAt)).getTime();
        } catch (error) {
            console.log(error)
        }
    }

    if (dtExpMs && dtExpMs > dtNowMs) return iamToken; //если файл есть и время не истекло, то выход

    try {
        const resp = await axios.post('https://iam.api.cloud.yandex.net/iam/v1/tokens', {yandexPassportOauthToken: oauth_token})
        console.log(resp)
        const {data} = resp;
        ({iamToken, expiresAt} = data);
        await writeFileAsync(filePath, JSON.stringify(data))

    } catch (error) {
        console.log(error)
    }

    return iamToken;
}