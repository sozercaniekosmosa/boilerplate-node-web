import React, {useEffect, useRef, useState} from 'react';
import {Tooltip} from "./Tooltip.tsx";
import clsx from "clsx";
import {getFontHeight} from "../../lib/dom.ts";

function fitToText(node: HTMLTextAreaElement) {
    node.style.height = 'auto';
    node.style.overflow = 'hidden';
    node.style.height = `${node.scrollHeight}px`;
    // const height = getFontHeight(node);
    // const len = node.textContent.split('\n').length;
    // node.style.height = height * (len + 1) - 3 + 'px';
}

function TextWrite({
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
                            "px-2 pt-[3px] pb-[4px] st-tx-light-[.9em]/[0.7]",
                            "border border-black/20 rounded-full",
                            "bg-white")}>
                        {caption}
                    </div>
                </Tooltip>
            </div>}
            <textarea value={value}
                      onChange={onChange}
                      ref={textareaRef}
                      rows={1}
                      placeholder={placeholder}
                      className={clsx(
                          'focus:bg-inherit st-focus',
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

export default TextWrite;