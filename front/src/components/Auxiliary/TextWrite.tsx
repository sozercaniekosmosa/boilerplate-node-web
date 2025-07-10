import React, {useEffect, useRef} from 'react';
import clsx from "clsx";
import {setStyle} from "../../lib/dom.ts";
import {Tooltip} from "./Tooltip.tsx";

function fitToText(node: HTMLTextAreaElement) {
    node.style.height = 'auto';
    node.style.overflow = 'hidden';
    node.style.height = `${node.scrollHeight}px`;
    // const height = getFontHeight(node);
    // const len = node.textContent.split('\n').length;
    // node.style.height = height * (len + 1) - 3 + 'px';
}

//language=css
setStyle(`
    .grow-wrap {
        display: grid;
    }

    .grow-wrap::after {
        content: attr(data-replicated-value) " ";
        white-space: pre-wrap;
        visibility: hidden;
    }

    .grow-wrap > textarea {
        resize: none;
        overflow: hidden;
    }

    .grow-wrap > textarea,
    .grow-wrap::after {
        grid-area: 1 / 1 / 2 / 2;
    }
`, '__Text__Write__');

function TextWrite1({
                        value,
                        onChange,
                        className = '',
                        style = {},
                        placeholder = "Введите текст",
                        caption = null,
                        fitToTextSize = false,
                        hint = null
                    }) {
    const refText = useRef(null);
    useEffect(() => {
        if (refText?.current) {
            refText.current.value = value;
            refText.current.parentNode.dataset.rv = value;
        }
    }, []);
    return <form action="#0">
        <div className="grow-wrap" data-rv={value}>
            <textarea name="text" id="text" onInput={({target}: any) => target.parentNode.dataset.rv = target.value} rows={1}
                      onChange={onChange}
                      placeholder={placeholder}
                      className={clsx(
                          'overflow-hidden',
                          'focus:bg-inherit st-focus st-air-tx',
                          caption ? 'pt-[0.4rem]' : 'pt-[0.24rem]',
                          "border border-none rounded-sm w-full",
                          "px-2 leading-[.9rem] min-h-[1.5rem]",
                          "resize-none",
                          "st-air-hover",
                          className,
                          fitToTextSize ? 'field-sizing-content' : ''
                      )}
                      style={{...style}}
                      ref={refText}
            ></textarea>
        </div>
    </form>
}


function TextWrite2({
                        value,
                        onChange,
                        className = '',
                        style = {},
                        placeholder = "Введите текст",
                        caption = null,
                        fitToTextSize = false,
                        hint = null
                    }) {

    return <textarea value={value}
                     onChange={onChange}
                     rows={1}
                     placeholder={placeholder}
                     className={clsx(
                         'overflow-hidden',
                         'focus:bg-inherit st-focus st-air-tx',
                         caption ? 'pt-[0.4rem]' : 'pt-[0.24rem]',
                         "border border-none rounded-sm w-full",
                         "px-2 leading-[.9rem] min-h-[1.5rem]",
                         "resize-none",
                         "st-air-hover",
                         className,
                         fitToTextSize ? 'field-sizing-content' : ''
                     )}
                     style={{...style}}></textarea>
}

function TextWrite3({
                        value,
                        onChange,
                        className = '',
                        style = {},
                        placeholder = "Введите текст",
                        caption = null,
                        fitToTextSize = false,
                        hint = null
                    }) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!textareaRef.current.checkVisibility() && fitToTextSize) fitToText(textareaRef.current);
    }, [])

    useEffect(() => {
        if (fitToTextSize && textareaRef.current) fitToText(textareaRef.current);
    }, [textareaRef, value]);

    function onInput() {
        if (fitToTextSize && textareaRef.current) fitToText(textareaRef.current);
    }

    return (
        <div className={clsx(
            'w-full',
            caption ? 'relative mt-2' : 'contents h-fit',
            fitToTextSize ? '' : 'h-full',
        )}>
            {caption && <div className="absolute flex !flex-row select-none top-[-0.7em] left-[1em]">
                <Tooltip style={{fontSize: '.8em'}} text={hint}>
                    <div
                        className={clsx(
                            "px-2 pt-[3px] pb-[4px] text-[.9em]/[0.7]",
                            "border border-black/20 rounded-full",
                            "bg-white")}>
                        {caption}
                    </div>
                </Tooltip>
            </div>}
            <textarea value={value}
                      onChange={onChange}
                      onInput={onInput}
                      ref={textareaRef}
                      rows={1}
                      placeholder={placeholder}
                      className={clsx(
                          'focus:bg-inherit st-focus st-air-tx',
                          caption ? 'pt-[0.4rem]' : 'pt-[0.24rem]',
                          "border border-none rounded-sm w-full",
                          "px-2 leading-[.9rem] min-h-[1.5rem]",
                          "resize-none",
                          "st-air-hover",
                          className
                      )}
                      style={{...style}}></textarea>
        </div>);
}

interface ITextWriteComponent {
    value: string;
    onChange: (e: any) => void;
    className?: string;
    style?: object;
    placeholder?: string;
    caption?: string;
    fitToTextSize?: boolean;
    hint?: string;
}

function TextWrite({...rest}: ITextWriteComponent) {
    return <TextWrite2 {...rest}/>
}

export default TextWrite;