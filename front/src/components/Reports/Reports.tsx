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

function Reports() {
    const [doc, setDoc] = useState()
    const [code, setCode] = useState()

    useEffect(() => {
        axios.get(glob.hostAPI + 'doc').then(({data}) => {
            // @ts-ignore
            setDoc(data)
        })

        axios.get(glob.hostAPI + 'code').then(({data}) => {
            // @ts-ignore
            setCode(data)
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

    return <Tabs defaultActiveKey="template" className="mb-1" id="reports">
        <Tab eventKey="template" title="Шаблоны" style={{flex: 1}} className="h-100">
            <SheetReports data={doc} setData={setDoc} height={80}/>
        </Tab>
        <Tab eventKey="script" title="Скрипт" style={{flex: 1, height: "inherit"}} className="">
            <ScriptReports code={code} setCode={setCode} height="calc(100% - 110px)"/>
        </Tab>
        <Tab eventKey="test" title="Проверка" style={{flex: 1, height: "inherit"}} className="">
            <TestReports code={code} setCode={setCode}/>
        </Tab>
    </Tabs>
}

export default Reports;