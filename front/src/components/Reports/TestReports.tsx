import ButtonEx from "../ButtonEx/ButtonEx.tsx";
import axios from "axios";
import glob from "../../glob.ts";
import {useEffect, useState} from "react";
import Select from "../Select/Select.tsx";
import {getCodeParam} from "../../lib/utils.ts";
import styled from "styled-components";
import {Button} from "react-bootstrap";

const listTypeReports = {'Excel': 'report-excel', 'Pdf': 'report-pdf',};

/**
 * Получить команду и имя индекс колонки
 * @paramVal row
 * @return [command, name, colIndex]
 */
// @ts-ignore
function getCommand(row: TRow): [string, string, number | null] {
    const arrCol = Object.entries(row.cells || {});
    for (let celX = 0; celX < arrCol.length; celX++) { // перебираем ячейки внутри строки

// @ts-ignore
        const [colIndex, cellData]: [string, TCellData] = arrCol[celX];
        const cmdName = cellData.text;

        if (typeof cmdName == 'string' && cmdName.includes('#')) {
            const [cmd, name] = cmdName.split('#');
            return [cmd, name, +colIndex]
        }
    }
    return ['', '', null];
}

function buildGetUrl(baseUrl, directory, params) {
    const url = new URL(baseUrl);

    // Обработка пути: объединение базового пути и директории
    const basePath = url.pathname.replace(/\/+$/, ''); // Удаление завершающих слешей
    if (!Array.isArray(directory)) directory = [directory];
    const dirPath = directory.map(it => it.replace(/^\/+/, '')).join('/'); // Удаление начальных слешей
    url.pathname = `${basePath}/${dirPath}`;

    // Обработка параметров
    if (params) {
        if (typeof params === 'string') {
            // Если параметры переданы как строка, заменяем текущие параметры
            url.search = params.startsWith('?') ? params.slice(1) : params;
        } else {
            // Если параметры переданы как объект, добавляем их к существующим
            const searchParams = new URLSearchParams(url.search);
            for (const [key, value] of Object.entries(params)) {
                searchParams.set(key, String(value));
            }
            url.search = searchParams.toString();
        }
    }

    return url.toString();
}

const TestOptions = styled.div.attrs({className: "d-flex flex-row gap-1 mx-2 my-2"})``;
const TestParams = styled.div.attrs({className: "position-relative border rounded mx-2 mt-3 px-2 pt-3 pb-1 mb-2"})`
    background-color: #fafafa;
`;
const DescParam = styled.div.attrs({className: "position-absolute z-1 px-2 rounded-4 border bg-white no-select"})`
    font-size: 1em;
    line-height: 0.7;
    padding: 3px 0 4px 0;
    top: -0.7em;
    left: 1em;
    position: absolute;
    display: flex;
    flex-direction: row !important;
`;
const TypeReport = styled(Select).attrs({className: "form-select form-select-sm"})``;
const Template = styled(Select).attrs({className: "form-select form-select-sm"})``;
const FileName = styled.input.attrs({
    className: "form-control form-control-sm",
    placeholder: "Введите имя файла отчета"
})``;

function getFltFn(doc, nameTemplate: string) {
    if (!nameTemplate) return;
    const _arrFltFn = [];
    const sheet = doc.find(it => it.name.toLocaleLowerCase() == nameTemplate); //ищем шаблон

    let arrRow = Object.values(sheet.rows).length;
    for (let i = 0; i < arrRow; i++) {
        const row = Object.values(sheet.rows)[i];
        const [cmd, name, colIndex] = getCommand(row);
        name && _arrFltFn.push(name);
    }
    console.log(_arrFltFn)
    return _arrFltFn;
}

let arrFltFn = [];

const URLReport = styled.div`

    * {
        height: 1.8em;
        font-size: 1.1em;
        line-height: 0;
    }
`

const BtnEx = styled(ButtonEx).attrs<{ $variant?: string; }>(props => ({
    className: `${props?.$variant} btn-sm flex-grow-0`
}))`width: 1.8em;
    height: 1.8em;`

const SelectSmf = styled(Select).attrs({
    className: 'ps-2 pe-5 py-0 w-auto'
})`
    height: 1.7em;
    font-size: 1.2em;
    line-height: 1.1;
`

function TestReports({doc, code, data, setData}) {
    const [url, setUrl] = useState('');
    const [type, setType] = useState('');
    const [listReports, setListReports] = useState([]);
    const [nameTemplate, setNameTemplate] = useState('');
    const [nameFile, setNameFile] = useState('');
    const [paramReport, setParamReport] = useState({});

    useEffect(() => {
        if (!doc) return;
        setType(listTypeReports.Excel);
        const arrSheetName = doc.map(it => it.name.toLocaleLowerCase());
        setListReports(arrSheetName);
        setNameTemplate(arrSheetName[0]);
    }, [doc]);

    useEffect(() => {
        if (!code) return;
        if (!nameTemplate) return;
        let arrParam = [];
        const arrFn = getCodeParam(code);
        arrFltFn = getFltFn(doc, nameTemplate);
        for (let i = 0; i < arrFn.length; i++) {
            const [nameFn, param] = arrFn[i];
            if (arrFltFn.includes(nameFn))
                arrParam.push(param ? param.replace(/\s/g, '').split(',').map(it => it.replace(/\s/g, '').split('=')[0]) : []);
        }
        arrParam = arrParam.flat().filter(it => it)
        const _paramReport = {};
        arrParam.forEach(it => _paramReport[it] = '');
        setParamReport(() => _paramReport);
        // console.log(paramReport);
    }, [code, nameTemplate]);

    useEffect(() => {
        const buildUrl = buildGetUrl(glob.hostAPI, [type, nameTemplate], {...paramReport, ...(nameFile ? {fileName: nameFile} : undefined)});
        setUrl(buildUrl);
    }, [listReports, type, nameTemplate, nameFile, paramReport]);

    return <>
        <URLReport className="input-group mt-2 ms-2 mb-2">
            <span className="input-group-text">URL</span>
            <input type="text" className="form-control" placeholder="Введите url запроса" value={url}
                   onChange={(e) => setUrl(e.target.value)}/>
            <ButtonEx className="btn btn-secondary bi-copy"
                      onAction={async () => await navigator.clipboard.writeText(url)}></ButtonEx>
            <ButtonEx className="btn btn-secondary"
                      onAction={() => axios.get(buildGetUrl(url, [], 'innerData=1'))}>Тест</ButtonEx>
            <ButtonEx className="btn btn-secondary me-3" onAction={() => axios.get(url)}>Отчет</ButtonEx>
        </URLReport>
        <TestOptions>
            <TypeReport arrList={listTypeReports} onChange={(val) => setType(val)} value={type}/>
            <Template arrList={listReports} onChange={(val: string) => setNameTemplate(val)} value={nameTemplate}/>
            <FileName type="text" value={nameFile} onChange={(e) => setNameFile(e.target.value)}/>
        </TestOptions>
        <TestParams>
            <DescParam>Параметры</DescParam>
            <div className="d-flex flex-row flex-wrap">
                {Object.entries(paramReport).map(([key, value]) => {
                    return <div className="input-group input-group-sm mb-1 me-1 w-auto" key={key}>
                        <span className="input-group-text" id="inputGroup-sizing-sm">{key}</span>
                        <input type="text" className="form-control w-auto flex-grow-0" value={value + ''}
                               onChange={(e) => {
                                   paramReport[key] = e.target.value;
                                   setParamReport({...paramReport});
                               }} placeholder="Введите значение"/>
                    </div>
                })}
            </div>
        </TestParams>
        <div className="mx-2 mt-3 mb-1 position-relative">
            <DescParam>Данные</DescParam>
            <textarea className="border rounded p-2 w-100" rows={10} value={data}
                      onChange={({target}) => setData(target.value)}/>
        </div>
    </>
}

export default TestReports;