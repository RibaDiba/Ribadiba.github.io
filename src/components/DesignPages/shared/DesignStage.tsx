"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./DesignStage.module.css";

/* ------------------------------------------------------------------ *
 * DesignStage — fixed hero canvas, scaled-to-fit.
 *
 * The `.des` case-study heroes are pixel-composed at a fixed size
 * (e.g. 684×640) with absolutely-positioned, hand-tilted cards. Desktop
 * windows are resizable, so this wrapper keeps the exact composition and
 * CSS-`scale()`s it to fit whatever space the window body gives us,
 * centering it with a cream letterbox. Reused by every design window and
 * by the mobile ProjectSheet.
 * ------------------------------------------------------------------ */

interface DesignStageProps {
    /** native canvas width in px */
    width: number;
    /** native canvas height in px */
    height: number;
    children: ReactNode;
    /** background for the fixed stage itself (e.g. the layered radial recipe) */
    stageStyle?: CSSProperties;
    /** color/gradient filling the letterbox area around the scaled stage */
    letterbox?: string;
    /** rendered in the outer wrapper, behind the scaled stage (e.g. a full-bleed shader) */
    behind?: ReactNode;
    /** CSS custom properties (accent colors, etc.) applied to the outer wrapper */
    style?: CSSProperties;
    className?: string;
}

export default function DesignStage({
    width,
    height,
    children,
    stageStyle,
    letterbox,
    behind,
    style,
    className
}: DesignStageProps) {
    const outerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0);

    useLayoutEffect(() => {
        const el = outerRef.current;
        if (!el) return;

        const measure = (w: number, h: number) => {
            if (w <= 0 || h <= 0) return;
            setScale(Math.min(w / width, h / height));
        };

        const observer = new ResizeObserver((entries) => {
            const box = entries[0].contentRect;
            measure(box.width, box.height);
        });
        observer.observe(el);
        measure(el.clientWidth, el.clientHeight);

        return () => observer.disconnect();
    }, [width, height]);

    return (
        <div
            ref={outerRef}
            className={`${styles.outer} ${className ?? ""}`}
            style={{ background: letterbox, ...style }}
        >
            {behind}
            <div
                className={styles.stage}
                style={{
                    width,
                    height,
                    transform: scale ? `scale(${scale})` : undefined,
                    visibility: scale ? "visible" : "hidden",
                    ...stageStyle
                }}
            >
                {children}
            </div>
        </div>
    );
}
