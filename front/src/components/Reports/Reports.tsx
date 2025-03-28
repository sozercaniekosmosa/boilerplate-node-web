import {Tab, Tabs} from "react-bootstrap";
import SheetReports from "./SheetReports.tsx";
import ScriptReports from "./ScriptReports.tsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import glob from "../../glob.ts";

function Reports() {
    const [doc, setDoc] = useState()
    const [code, setCode] = useState()

    useEffect(() => {
        axios.get(glob.hostAPI + 'doc').then(data => {
            // @ts-ignore
            setDoc(data.data.doc)
        })

        axios.get(glob.hostAPI + 'code').then(data => {
            // @ts-ignore
            setCode(data.data.code)
        })
    }, []);

    useEffect(() => {
        if (!doc) return;
        // console.log(doc)
        axios.post(glob.hostAPI + 'store', {doc})
    }, [doc])
    useEffect(() => {
        if (!code) return;
        // console.log(code)
        axios.post(glob.hostAPI + 'code', {code})
    }, [code])

    return <Tabs defaultActiveKey="template" className="mb-1">
        <Tab eventKey="template" title="Шаблоны" style={{flex: 1}} className="h-100">
            <SheetReports data={doc} setData={setDoc} height={80}/>
        </Tab>
        <Tab eventKey="script" title="Скрипт" style={{flex: 1, height: "inherit"}} className="">
            <ScriptReports code={code} setCode={setCode} height="calc(100% - 110px)"/>
        </Tab>
    </Tabs>
}

export default Reports;