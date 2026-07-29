"use client";

import type { CSSProperties } from "react";
import { getAssetPath } from "@/utils/paths";
import DesignStage from "./shared/DesignStage";
import shared from "./shared/designShared.module.css";
import styles from "./SaveRe.module.css";

import type { DesignCardProps } from "@/interfaces/portfolio";

/* ------------------------------------------------------------------ *
 * SavRe.des — "Signal Stack" case-study window.
 * Food-waste tracking app (Princeton Hacks F25). A fixed 684×640 hero:
 * a copy column (headline, role card, design-language card) beside a
 * diagonal cascade of the three real app screens. Rebuilt from the
 * handoff; the retro window chrome is supplied by the desktop shell.
 * ------------------------------------------------------------------ */

const CREAM = "#FAF6ED";

const STAGE_BG =
    "radial-gradient(440px 400px at 2% -10%, rgba(53,74,51,.6) 0%, rgba(53,74,51,.6) 22%, transparent 56%)," +
    "radial-gradient(380px 340px at 100% 106%, rgba(203,223,201,.9) 0%, rgba(203,223,201,.9) 20%, transparent 54%)," +
    "radial-gradient(280px 260px at 85% 6%, rgba(111,163,106,.4) 0%, transparent 58%)," +
    "radial-gradient(320px 280px at -8% 96%, rgba(230,242,228,.85) 0%, transparent 54%)," +
    "radial-gradient(260px 240px at 55% 45%, rgba(53,74,51,.14) 0%, transparent 60%)," +
    CREAM;

const v = (props: Record<string, string | number>) => props as CSSProperties;

export default function SaveRe({ roleCard, designLanguageCard }: DesignCardProps) {
    return (
        <DesignStage
            width={684}
            height={640}
            className={shared.root}
            style={v({ "--accent": "#354A33", "--ink": "#2A211E" })}
            stageStyle={{ background: STAGE_BG }}
            letterbox={CREAM}
        >
            {/* headline */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 26, left: 26, width: 236, zIndex: 8, animationDelay: "0s" }}
            >
                <div className={shared.float} style={v({ "--amp": "-7px", "--dur": "8.4s", "--delay": ".2s" })}>
                    <h1 className={shared.headlineRed} style={{ fontSize: 25 }}>
                        Three Screens,
                    </h1>
                    <h1 className={shared.headlineInk} style={{ fontSize: 20 }}>
                        One Pantry System
                    </h1>
                    <p className={shared.sub}>
                        <b style={{ color: "#2E402C" }}>Submission for Princeton Hacks F25!</b>
                    </p>
                </div>
            </div>

            {/* role card */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 160, left: 20, width: 236, zIndex: 7, transform: "rotate(-1deg)", animationDelay: ".1s" }}
            >
                <div className={shared.float} style={v({ "--amp": "-9px", "--dur": "9.2s", "--delay": ".4s" })}>
                    <div className={shared.card}>
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
                        <div className={shared.links}>
                            {roleCard.linkHref ? (
                                <a
                                    className={shared.link}
                                    href={roleCard.linkHref}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {roleCard.linkText}
                                </a>
                            ) : roleCard.linkText ? (
                                <span className={shared.link}>{roleCard.linkText}</span>
                            ) : null}
                            {roleCard.figmaLinkHref ? (
                                <a
                                    className={shared.link}
                                    href={roleCard.figmaLinkHref}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {roleCard.figmaLinkText || "Figma →"}
                                </a>
                            ) : roleCard.figmaLinkText ? (
                                <span className={shared.link}>{roleCard.figmaLinkText}</span>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* design-language card */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 347, left: 25, width: 236, zIndex: 7, transform: "rotate(1deg)", animationDelay: ".18s" }}
            >
                <div className={shared.float} style={v({ "--amp": "-8px", "--dur": "10s", "--delay": ".6s" })}>
                    <div className={shared.langCard}>
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

            {/* screenshot cascade */}
            <div
                className={shared.enter}
                style={{ position: "absolute", left: 230, top: 8, zIndex: 4, animationDelay: ".3s" }}
            >
                <div className={shared.float} style={v({ "--amp": "-13px", "--dur": "9.6s", "--delay": ".5s" })}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className={styles.shot}
                        src={getAssetPath("/DesignAssets/savre-signal-stack-real.png")}
                        width={440}
                        alt="SaveRe app screens — Profile, Calendar, and Home cascading"
                    />
                </div>
            </div>
        </DesignStage>
    );
}
