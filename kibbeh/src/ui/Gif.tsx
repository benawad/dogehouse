import React, { MouseEvent, TouchEvent } from "react";

interface GifProps {
    clickHandler: (id: string) => void;
    srcStill: string;
    srcGif: string;
    title: string;
    className: string;
    id: string;
    togglable: boolean;
    enabledGif: boolean;
}

export const Gif: React.FC<GifProps> = ({
    clickHandler,
    srcStill,
    srcGif,
    title,
    className,
    id,
    togglable,
    enabledGif }) => {

    const toggle = (e: MouseEvent<HTMLElement, globalThis.MouseEvent> | TouchEvent<HTMLElement>) => {
        if (togglable) {
            e.currentTarget.setAttribute('src', e.currentTarget.getAttribute('src') === srcGif ? srcStill : srcGif);
        }
    }
    const clicked = (e: MouseEvent<HTMLElement, globalThis.MouseEvent> | TouchEvent<HTMLElement>) => {
        toggle(e);
        clickHandler(id);
    }
    return (
        <img
            onClick={clicked}
            onTouchStart={clicked}
            onMouseEnter={toggle}
            onMouseLeave={toggle}
            className={className}
            alt={title}
            src={enabledGif ? srcGif : srcStill}
        />
    );
};