import React, {useRef, useEffect} from 'react';
import {Tooltip} from "./Tooltip.tsx";
import clsx from "clsx";

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
        if (fitToTextSize && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.overflow = 'hidden';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [textareaRef, value]);

    const handleInput = () => {
        if (fitToTextSize)
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
    };

    return (

        <div className={clsx(
            caption ? 'relative mt-2' : 'contents h-fit',
            fitToTextSize ? '' : 'h-full',
        )}>
            {caption && <div className="absolute flex !flex-row select-none top-[-0.7em] left-[1em]">
                <Tooltip style={{fontSize: '.8em'}} text={placeholder}>
                    <div
                        className="px-2 border border-black/20 rounded-full bg-white text-[.9em]/[0.7] pt-[3px] pb-[4px]">{caption}</div>
                </Tooltip>
            </div>}
            <textarea value={value}
                      onChange={onChange}
                      ref={textareaRef}
                      onInput={handleInput}
                      rows={1}
                      placeholder={placeholder}
                      className={clsx(
                          "resize-none border border-black/20 rounded-sm w-full px-2 pt-[0.24rem] leading-[.9rem] min-h-[1.5rem]",
                          className
                      )}
                      style={{...style}}></textarea>
        </div>);
}

export default TextWrite;