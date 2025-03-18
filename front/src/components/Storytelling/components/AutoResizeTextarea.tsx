import React, {useRef, useEffect} from 'react';
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";

function AutoResizeTextarea({value, onChange, className = '', style = {}, placeholder = "Введите текст", description = null, hint = null}) {
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


    let lt_style = {
        top: '-0.6em',
        fontSize: '0.9em',
        left: '1em',
        lineHeight: '0.7',
        padding: '2px 0 3px 0'
    };
    return (

        <div className="position-relative mt-2">

            {description && <div className="position-absolute d-flex flex-row no-select" style={lt_style}>
                <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip" style={{fontSize: '.8em'}}>{placeholder}</Tooltip>}>
                    <label className="px-1 rounded border bg-white" style={lt_style}>{description}</label>
                </OverlayTrigger>
                {/*<label className="px-1 rounded border bg-white" style={lt_style}>!</label>*/}
            </div>}
            <textarea value={value}
                      onChange={onChange}
                      ref={textareaRef}
                      onInput={handleInput}
                      rows={1}
                      placeholder={placeholder}
                      className={"form-control " + className}
                      style={{overflow: 'hidden', ...style}}></textarea>
        </div>);
}

export default AutoResizeTextarea;