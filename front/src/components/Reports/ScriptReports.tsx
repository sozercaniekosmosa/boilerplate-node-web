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
import beautify from 'js-beautify';

const arrTheme = ['monokai', 'github', 'tomorrow', 'kuroir', 'twilight', 'xcode', 'textmate', 'solarized_dark', 'solarized_light', 'terminal'];

let lang = 'javascript';
const TIME_THROTTLE_MS = 2500;
const validateCode = throttle(clb => clb(), TIME_THROTTLE_MS)

const Editor = styled.div.attrs({className: 'd-flex flex-column flex-nowrap m-1'})`
    height: inherit;

    .ace-editor {
        border: 1px solid #e7e7e7;
        height: inherit;
        resize: vertical;
    }
`
const Control = styled.div.attrs({className: 'd-flex gap-1 mb-1 zoom-out-container'})``

const optionsBeautyScript = {
    "indent_size": "4",
    "indent_char": " ",
    "max_preserve_newlines": "5",
    "preserve_newlines": true,
    "keep_array_indentation": false,
    "break_chained_methods": false,
    "indent_scripts": "normal",
    "brace_style": "collapse",
    "space_before_conditional": true,
    "unescape_strings": false,
    "jslint_happy": false,
    "end_with_newline": false,
    "wrap_line_length": "0",
    "indent_inner_html": false,
    "comma_first": false,
    "e4x": false,
    "indent_empty_lines": false
}


const BtnEx = styled(ButtonEx).attrs<{ $variant?: string; }>(props => ({
    className: `${props?.$variant} btn-sm flex-grow-0`
}))`width: 1.8em;
    height: 1.8em;`

const SelectTheme = styled(Select).attrs({className: 'ps-2 pe-5 py-0 w-auto'})`
    height: 1.7em;
    font-size: 1.2em;
    line-height: 1.1;
`

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
            <BtnEx className="btn btn-secondary bi-card-text" onClick={() => {
                setCode(beautify.js(code, optionsBeautyScript));
            }} title="Структурировать код"/>
            <SelectTheme arrList={arrTheme} onChange={changeTheme} value={theme} className="w-auto"/>
        </Control>
        <AceEditor
            className="ace-editor"
            width={width}
            height={height}
            showPrintMargin={false}
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