import React, {useRef, useEffect} from 'react';

function AutoResizeTextarea({value, onChange, className = ''}) {
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
        <textarea
            value={value}
            onChange={onChange}
            ref={textareaRef}
            onInput={handleInput}
            rows={1}
            placeholder="Введите текст"
            className={className}
            style={{overflow: 'hidden'}}
        />
    );
}

export default AutoResizeTextarea;