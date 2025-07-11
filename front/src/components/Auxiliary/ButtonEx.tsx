//0-ok, 1-processing, 2-error
import React, {FC, PropsWithChildren, useState} from "react";
import Dialog from "./Dialog.tsx";
import {Tooltip, TTooltipDirection} from "./Tooltip.tsx";
import Spinner from "./Spinner.tsx";
import clsx from "clsx";

interface IButtonExProps extends PropsWithChildren {
    style?: React.CSSProperties,
    className?: string,
    onAction?: (e?: React.MouseEvent<HTMLElement>) => Promise<number | any> | number | void,
    onClick?: (e?: React.MouseEvent<HTMLElement>) => void,
    onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void,
    dialogContent?: React.FC | React.ReactElement,
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
                                          dialogContent = null,
                                          title = null,
                                          dir = "right",
                                          description = 'Добавьте текст...',
                                          text = '',
                                          autoFocus = false,
                                          ...rest
                                      }) => {
    const [_state, set_state] = useState<number | void>(0)
    const [showAndDataEvent, setShowAndDataEvent] = useState<React.MouseEvent<HTMLElement>>();


    let onAct = async (e: React.MouseEvent<HTMLElement>) => {
        if (disabled) return;
        onClick && onClick(e);
        if (onConfirm) {
            if (e.ctrlKey) { //если с ctrl то без подтверждения
                onConfirm(showAndDataEvent);
            } else {
                setShowAndDataEvent(e)
            }
            return e;
        }
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
                'relative',
                'flex justify-center items-center',
                'p-1',
                'st-air ',
                disabled ? '' : 'st-focus ',
                disabled ? '' : 'st-air-hover',
                _state == 2 ? 'st-danger' : '',
                // _state == 1 || disabled ? 'bg-light-disabled' : '',
                _state == 1 || disabled ? 'text-current/20' : '',
            )}
            onClick={onAct} hidden={hidden} {...rest}>
            {title && <Tooltip text={title} direction={dir} className="!absolute w-full h-full"/>}
            {_state == 1 && <Spinner/>}
            {hidden ? '' : children}
            {hidden ? '' : text}
        </button>}
        {onConfirm ? <Dialog
            title={description} message="Уверены?"
            show={showAndDataEvent} setShow={setShowAndDataEvent}
            onConfirm={async () => onConfirm(showAndDataEvent)}
            props={{className: 'modal-sm'}}>{dialogContent}</Dialog> : ''}
    </>
};

export default ButtonEx;