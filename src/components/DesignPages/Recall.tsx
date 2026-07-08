"use client";

import type { CSSProperties } from "react";
import { getAssetPath } from "@/utils/paths";
import DesignStage from "./shared/DesignStage";
import shared from "./shared/designShared.module.css";
import styles from "./Recall.module.css";

import type { DesignCardProps } from "@/interfaces/portfolio";

/* ------------------------------------------------------------------ *
 * Recall.des — "v2 hero" case-study window.
 * Face-recognition companion for dementia patients. A fixed 684×540
 * hero: a centered wordmark + two in-app pill buttons over a full-width
 * hero render, with a role card and a design-language card beneath.
 * Rebuilt from the handoff; window chrome supplied by the desktop shell.
 * ------------------------------------------------------------------ */

const CREAM = "#FAF6ED";

const STAGE_BG =
    "radial-gradient(440px 400px at 2% -10%, rgba(33,98,45,.62) 0%, rgba(33,98,45,.62) 22%, transparent 56%)," +
    "radial-gradient(380px 340px at 100% 106%, rgba(207,224,198,.9) 0%, rgba(207,224,198,.9) 20%, transparent 54%)," +
    "radial-gradient(280px 260px at 85% 6%, rgba(67,93,71,.4) 0%, transparent 58%)," +
    "radial-gradient(320px 280px at -8% 96%, rgba(220,234,211,.8) 0%, transparent 54%)," +
    "radial-gradient(260px 240px at 55% 45%, rgba(33,98,45,.16) 0%, transparent 60%)," +
    CREAM;

const v = (props: Record<string, string | number>) => props as CSSProperties;

const CameraIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"
            stroke="#fff"
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3.2" stroke="#fff" strokeWidth={1.6} />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
            stroke="#fff"
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
    </svg>
);

export default function Recall({ roleCard, designLanguageCard }: DesignCardProps) {
    return (
        <DesignStage
            width={684}
            height={540}
            className={shared.root}
            style={v({ "--accent": "#21622D", "--ink": "#2A211E" })}
            stageStyle={{ background: STAGE_BG }}
            letterbox={CREAM}
        >
            {/* wordmark */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)", zIndex: 6, animationDelay: "0s" }}
            >
                <div className={shared.float} style={v({ "--amp": "-6px", "--dur": "9s", "--delay": ".2s" })}>
                    <h1 className={shared.wordmark}>Recall</h1>
                </div>
            </div>

            {/* in-app buttons */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 104, left: "50%", transform: "translateX(-50%)", zIndex: 6, display: "flex", gap: 10, animationDelay: ".1s" }}
            >
                <div className={shared.float} style={v({ "--amp": "-7px", "--dur": "8.4s", "--delay": ".4s" })}>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button type="button" className={styles.appBtn} style={{ transform: "rotate(-1deg)" }}>
                            <span className={styles.badge}>
                                <CameraIcon />
                            </span>
                            Use Camera
                        </button>
                        <button type="button" className={styles.appBtn} style={{ transform: "rotate(1deg)" }}>
                            <span className={styles.badge}>
                                <PhoneIcon />
                            </span>
                            Call for Help
                        </button>
                    </div>
                </div>
            </div>

            {/* full-width hero render */}
            <div
                className={shared.enter}
                style={{ position: "absolute", left: 11, top: 117, zIndex: 4, animationDelay: ".2s" }}
            >
                <div className={shared.float} style={v({ "--amp": "-10px", "--dur": "10s", "--delay": ".3s" })}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className={styles.hero}
                        src={getAssetPath("/DesignAssets/recall-v2-hero-full.png")}
                        alt="Recall app — recognizing a familiar face with name and relation"
                        style={{ width: 680 }}
                    />
                </div>
            </div>

            {/* role card */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 380, left: 39, width: 301, minHeight: 132, zIndex: 6, animationDelay: ".3s" }}
            >
                <div className={shared.float} style={v({ "--amp": "-8px", "--dur": "9.6s", "--delay": ".5s" })}>
                    <div
                        className={shared.card}
                        style={{ transform: "rotate(-1deg)" }}
                    >
                        <div className={shared.meta}>
                            <div className={shared.k}>role</div>
                            <div>{roleCard.role}</div>
                            <div className={shared.k}>year</div>
                            <div>{roleCard.year}</div>
                            <div className={shared.k}>stack</div>
                            <div>{roleCard.stack}</div>
                        </div>
                        <div className={shared.tags}>
                            {roleCard.tags.map((tag) => (
                                <span key={tag} className={shared.tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {roleCard.linkHref ? (
                            <a
                                className={shared.link}
                                href={roleCard.linkHref}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {roleCard.linkText}
                            </a>
                        ) : (
                            <span className={shared.link}>{roleCard.linkText}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* design-language card */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 420, left: 359, width: 301, minHeight: 101, zIndex: 5, animationDelay: ".4s" }}
            >
                <div className={shared.float} style={v({ "--amp": "-7px", "--dur": "10.5s", "--delay": ".7s" })}>
                    <div
                        className={shared.langCard}
                        style={{ transform: "rotate(1deg)" }}
                    >
                        <div className={shared.langSwatches}>
                            {designLanguageCard.swatches.map((color, idx) => (
                                <span key={idx} style={{ background: color }} />
                            ))}
                        </div>
                        <div>
                            <div className={shared.k} style={{ marginBottom: 3 }}>
                                design language
                            </div>
                            <div>{designLanguageCard.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        </DesignStage>
    );
}
