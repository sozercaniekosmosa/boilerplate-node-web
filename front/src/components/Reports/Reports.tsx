import {Tab, Tabs} from "react-bootstrap";
import SheetReports from "./SheetReports.tsx";
import ScriptReports from "./ScriptReports.tsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import glob from "../../glob.ts";
import {debounce} from "../../lib/utils.ts";
import TestReports from "./TestReports.tsx";

const saveDoc: (doc: string) => void = debounce((doc: string) => axios.post(glob.hostAPI + 'doc', {doc}), 1000);
const saveCode: (code: string) => void = debounce((code: string) => axios.post(glob.hostAPI + 'code', {code}), 3000);
const saveData: (data: string) => void = debounce((data: string) => axios.post(glob.hostAPI + 'data', {data}), 3000);

function Reports() {
    const [doc, setDoc] = useState()
    const [code, setCode] = useState()
    const [data, setData] = useState()

    useEffect(() => {
        axios.get(glob.hostAPI + 'doc').then(({data}) => {
            // @ts-ignore
            setDoc(data)
        })

        axios.get(glob.hostAPI + 'code').then(({data}) => {
            // @ts-ignore
            setCode(data)
        })

        axios.get(glob.hostAPI + 'data').then(({data}) => {
            // @ts-ignore
            setData(JSON.stringify(data, null, 2))
        })
    }, []);

    useEffect(() => {
        if (!doc) return;
        saveDoc(doc);
    }, [doc])

    useEffect(() => {
        if (!code) return;
        saveCode(code);
    }, [code])

    useEffect(() => {
        if (!data) return;
        saveData(JSON.parse(data));
    }, [data])

    return <Tabs defaultActiveKey="template" className="mb-1" id="reports">
        <Tab eventKey="template" title="Конструктор" style={{flex: 1}} className="h-100">
            <SheetReports doc={doc} setDoc={setDoc} height={80}/>
        </Tab>
        <Tab eventKey="data" title="Данные" style={{flex: 1, height: "inherit"}} className="">
            <ScriptReports code={code} setCode={setCode} height="calc(100% - 110px)"/>
        </Tab>
        <Tab eventKey="test" title="Тестирование" style={{flex: 1, height: "inherit"}} className="">
            <TestReports doc={doc} code={code} data={data} setData={setData}/>
        </Tab>
    </Tabs>
}

export default Reports;