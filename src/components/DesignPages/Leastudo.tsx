"use client";

import type { CSSProperties } from "react";
import { getAssetPath } from "@/utils/paths";
import DesignStage from "./shared/DesignStage";
import shared from "./shared/designShared.module.css";

import type { DesignCardProps } from "@/interfaces/portfolio";

/* ------------------------------------------------------------------ *
 * Leastudo.des — "Starburst Fan" case-study window.
 * Moving-out/moving-in subleasing marketplace. A fixed 684×660 hero:
 * a centered wordmark + pill CTAs above a fanned hand of photo cards,
 * flanked by a role card and a design-language card. Rebuilt from the
 * handoff; the retro window chrome is supplied by the desktop shell.
 * ------------------------------------------------------------------ */

const CREAM = "#F6F0E7";

const STAGE_BG =
    "radial-gradient(460px 420px at 2% -12%, rgba(122,27,27,.52), transparent 60%)," +
    "radial-gradient(400px 360px at 100% 108%, rgba(231,182,182,.72), transparent 58%)," +
    "radial-gradient(300px 280px at 85% 8%, rgba(74,85,101,.3), transparent 62%)," +
    "radial-gradient(340px 300px at -8% 98%, rgba(232,201,201,.6), transparent 58%)," +
    "radial-gradient(280px 260px at 55% 45%, rgba(122,27,27,.14), transparent 65%)," +
    CREAM;

const v = (props: Record<string, string | number>) => props as CSSProperties;

const PHOTOS = [
    { src: "leastudo-card-day1.png", w: 192, left: 56, top: 370, rot: -13, z: 1, delay: ".20s", amp: "-8px", dur: "8.5s", floatDelay: ".1s" },
    { src: "leastudo-card-tempo.png", w: 206, left: 196, top: 338, rot: -4, z: 2, delay: ".26s", amp: "-10px", dur: "9.2s", floatDelay: ".3s" },
    { src: "leastudo-card-hub.png", w: 206, left: 330, top: 328, rot: 4, z: 3, delay: ".32s", amp: "-7px", dur: "8s", floatDelay: ".5s" },
    { src: "leastudo-card-day2.png", w: 192, left: 466, top: 366, rot: 13, z: 1, delay: ".38s", amp: "-9px", dur: "9.6s", floatDelay: ".2s" }
];

export default function Leastudo({ roleCard, designLanguageCard }: DesignCardProps) {
    return (
        <DesignStage
            width={684}
            height={660}
            className={shared.root}
            style={v({ "--accent": "#7A1B1B", "--ink": "#2A211E", "--btn-primary": "#5C1414" })}
            stageStyle={{ background: STAGE_BG }}
            letterbox={CREAM}
        >
            {/* wordmark */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", zIndex: 6, animationDelay: "0s" }}
            >
                <h1 className={shared.wordmark}>Leastudo</h1>
            </div>

            {/* CTAs */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 106, left: "50%", transform: "translateX(-50%)", zIndex: 6, display: "flex", gap: 10, animationDelay: ".08s" }}
            >
                <button type="button" className={`${shared.btn} ${shared.btnPrimary}`} style={{ transform: "rotate(-2deg)" }}>
                    <span className={`${shared.ico} ${shared.icoPlus}`} />
                    List Your Place
                </button>
                <button type="button" className={`${shared.btn} ${shared.btnSecondary}`} style={{ transform: "rotate(2deg)" }}>
                    <span className={`${shared.ico} ${shared.icoMag}`} />
                    Find Your Lease
                </button>
            </div>

            {/* headline */}
            <div
                className={shared.enter}
                style={{ position: "absolute", top: 210, left: 300, width: 360, zIndex: 6, transform: "rotate(-2deg)", animationDelay: ".05s" }}
            >
                <h1 className={shared.headlineRed} style={{ fontSize: 22 }}>
                    Moving Out?
                </h1>
                <h1 className={shared.headlineInk} style={{ fontSize: 19 }}>
                    Someone&apos;s Moving In
                </h1>
                <p className={shared.sub}>
                    <b>Connect with someone</b> who needs what you&apos;re leaving behind.
                </p>
            </div>

            {/* role card */}
            <div
                className={`${shared.card} ${shared.enter}`}
                style={{ position: "absolute", top: 174, left: 24, width: 222, zIndex: 5, transform: "rotate(-2deg)", animationDelay: ".14s" }}
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
                    <a className={shared.link} href={roleCard.linkHref} target="_blank" rel="noreferrer">
                        {roleCard.linkText}
                    </a>
                ) : (
                    <span className={shared.link}>{roleCard.linkText}</span>
                )}
            </div>

            {/* fanned photo cards */}
            {PHOTOS.map((photo) => (
                <div
                    key={photo.src}
                    className={shared.enter}
                    style={{
                        position: "absolute",
                        left: photo.left,
                        top: photo.top,
                        zIndex: photo.z,
                        animationDelay: photo.delay
                    }}
                >
                    <div
                        className={shared.float}
                        style={v({
                            "--amp": photo.amp,
                            "--dur": photo.dur,
                            "--delay": photo.floatDelay,
                            "--r": `${photo.rot}deg`
                        })}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className={shared.photo}
                            src={getAssetPath(`/DesignAssets/${photo.src}`)}
                            alt=""
                            style={{ width: photo.w }}
                        />
                    </div>
                </div>
            ))}

            {/* design-language card */}
            <div
                className={`${shared.langCard} ${shared.enter}`}
                style={{ position: "absolute", top: 544, left: "50%", transform: "translateX(-50%) rotate(1deg)", width: 400, zIndex: 4, animationDelay: ".44s" }}
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
        </DesignStage>
    );
}
