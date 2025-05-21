//0-ok, 1-processing, 2-error
import React, {FC, PropsWithChildren, useState} from "react";
import Dialog from "./Dialog.tsx";
import {Tooltip, TTooltipDirection} from "./Tooltip.tsx";
import Spinner from "./Spinner.tsx";
import clsx from "clsx";

interface IButtonExProps extends PropsWithChildren {
    style?: React.CSSProperties,
    className?: string,
    onAction?: (e?: React.MouseEvent<HTMLElement>) => Promise<number> | number | void,
    onClick?: (e?: React.MouseEvent<HTMLElement>) => void,
    onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void,
    disabled?: boolean,
    hidden?: boolean,
    title?: string,
    dir?: TTooltipDirection,
    description?: string,
    text?: string,
    autoFocus?: boolean
}

const ButtonEx: FC<IButtonExProps> = ({
                                          style = {},
                                          className = '',
                                          onAction = null,
                                          onClick = null,
                                          disabled = false,
                                          hidden = false,
                                          children = null,
                                          onConfirm = null,
                                          title = null,
                                          dir = "right",
                                          description = 'Добавьте текст...',
                                          text = '',
                                          autoFocus = false
                                      }) => {
    const [_state, set_state] = useState<number | void>(0)
    const [showAndDataEvent, setShowAndDataEvent] = useState<React.MouseEvent<HTMLElement>>();


    let onAct = async (e: React.MouseEvent<HTMLElement>) => {
        if (onConfirm) {
            if (e.ctrlKey) { //если с ctrl то без подтверждения
                onConfirm(showAndDataEvent);
            } else {
                setShowAndDataEvent(e)
            }
            return e;
        }
        onClick && onClick(e)
        if (onAction) {
            set_state(1)
            const s = await onAction(e) //TODO: тут можно сделать try..catch на отлов ошибок или Promise callback
            setTimeout(() => set_state(s), 500);
        }
    }

    return <>
        {!hidden && <button
            autoFocus={autoFocus}
            style={style}
            className={clsx(
                className,
                // 'w-6 h-6',
                'relative',
                'text-base text-white p-1 rounded-sm',
                'focus:outline-none focus:ring-3 focus:ring-offset-0 focus:ring-gray-500/50 select-none',
                'bg-gray-500  hover:bg-gray-600 transition',
                'flex justify-center items-center',
                _state == 2 ? '!outline-red-700 !outline-1 !outline-offset-1' : '',
                _state == 1 || disabled ? '!bg-gray-400 pointer-events-none' : ''
            )}
            onClick={onAct} hidden={hidden}>
            {title && <Tooltip text={title} direction={dir} className="!absolute w-full h-full"/>}
            {_state == 1 && <Spinner/>}
            {hidden ? '' : children}
            {hidden ? '' : text}
        </button>}
        {onConfirm ?
            <Dialog title={description} message="Уверены?" show={showAndDataEvent} setShow={setShowAndDataEvent}
                    onConfirm={async () => onConfirm(showAndDataEvent)}
                    props={{className: 'modal-sm'}}/> : ''}
    </>
};

export default ButtonEx;