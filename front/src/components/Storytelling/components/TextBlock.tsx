import React, {useRef, useEffect} from 'react';
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import styled from "styled-components";


const Label = styled.div.attrs({className: 'px-2 rounded-4 border bg-white'})`
    font-size: .9em;
    line-height: 0.7;
    padding: 3px 0 4px 0;
`

const Header = styled.div.attrs({
    className: 'position-absolute d-flex flex-row no-select',
})`
    top: -0.7em;
    left: 1em;
    position: absolute;
    display: flex;
    flex-direction: row !important;
`

function TextBlock({value, onChange, className = '', style = {}, placeholder = "Введите текст", caption = null, hint = null}) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [textareaRef]);

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    return (

        <div className={"position-relative " + (caption ? 'mt-2 ' : '') + className}>
            {caption && <Header>
                <OverlayTrigger placement="right" overlay={<Tooltip style={{fontSize: '.8em'}}>{placeholder}</Tooltip>}>
                    <Label>{caption}</Label>
                </OverlayTrigger>
            </Header>}
            <textarea value={value}
                      onChange={onChange}
                      ref={textareaRef}
                      onInput={handleInput}
                      rows={1}
                // placeholder={placeholder}
                      className={"form-control no-resize"}
                      style={{overflow: 'hidden', ...style}}></textarea>
        </div>);
}

export default TextBlock;