import React, {useEffect, useState} from "react";

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

const arrTheme = ['monokai', 'github', 'tomorrow', 'kuroir', 'twilight', 'xcode', 'textmate', 'solarized_dark', 'solarized_light', 'terminal'];

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


function ScriptReports({code, setCode, width = '100%', height = '100%'}) {
    const [theme, setTheme] = useState('textmate')

    useEffect(() => {
    }, [])


    function changeCode(newValue: string) {
        setCode(newValue);
    }

    function changeTheme(value: string) {
        setTheme(value);
    }

    return <Editor>
        <Control>
            <ButtonEx className="btn btn-secondary bi-floppy"></ButtonEx>
            <ButtonEx className="btn btn-secondary bi-list-check"></ButtonEx>
            <Select arrList={arrTheme} onChange={changeTheme} value={theme} className="w-auto"/>
            <ButtonEx className="btn btn-secondary bi-eye"></ButtonEx>
        </Control>
        <AceEditor
            className="ace-editor"
            width={width}
            height={height}
            mode={lang}
            theme={theme}
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