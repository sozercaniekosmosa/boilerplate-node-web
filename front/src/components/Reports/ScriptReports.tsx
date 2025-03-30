import React, {useEffect, useRef, useState} from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-inline_autocomplete";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/snippets/python";
import styled from "styled-components";
import Select from "../Select/Select.tsx";
import ButtonEx from "../ButtonEx/ButtonEx.tsx";
import {debounce, throttle} from "../../lib/utils.ts";

import AcornWorker from './acorn.worker?worker';

const arrTheme = ['monokai', 'github', 'tomorrow', 'kuroir', 'twilight', 'xcode', 'textmate', 'solarized_dark', 'solarized_light', 'terminal'];

const TIME_THROTTLE_MS = 2500;
let lang = 'javascript';

const Editor = styled.div.attrs({className: 'd-flex flex-column flex-nowrap m-1'})`
    height: inherit;

    .ace-editor {
        border: 1px solid #e7e7e7;
        height: inherit;
        resize: vertical;
    }
`
const Control = styled.div.attrs({className: 'd-flex /*align-self-end*/ gap-1 mb-1'})``

const validateCode = throttle(clb => clb(), TIME_THROTTLE_MS)

function ScriptReports({code, setCode, width = '100%', height = '100%'}) {
    const [theme, setTheme] = useState('textmate')
    const [annotations, setAnnotations] = useState([]);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new AcornWorker();
        workerRef.current.onmessage = (event) => setAnnotations(event.data.annotations);//answer from worker

        return () => workerRef.current?.terminate(); //destroy worker
    }, []);

    const changeCode = (newValue: string) => {
        setCode(newValue);
        // @ts-ignore
        validateCode(() => {
            workerRef.current?.postMessage({code: newValue});
            console.log('store code')
        });
    };


    function changeTheme(value: string) {
        setTheme(value);
    }

    return <Editor>
        <Control>
            <ButtonEx className="btn btn-secondary bi-floppy"></ButtonEx>
            <Select arrList={arrTheme} onChange={changeTheme} value={theme} className="w-auto"/>
        </Control>
        <AceEditor
            className="ace-editor"
            width={width}
            height={height}
            mode={lang}
            theme={theme}
            annotations={annotations}
            onChange={changeCode}
            name="ace-editor"
            editorProps={{$blockScrolling: true}}
            setOptions={{
                useWorker: false,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
            }}
            value={code}
        />
    </Editor>
}

export default ScriptReports;