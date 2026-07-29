"use client";

import type { CSSProperties } from "react";
import DesignStage from "./shared/DesignStage";
import SolShader from "./SolShader";
import styles from "./Sol.module.css";
import shared from "./shared/designShared.module.css";

import type { DesignCardProps } from "@/interfaces/portfolio";

/* ------------------------------------------------------------------ *
 * Sol.des — "Filmstrip" case-study window.
 * UMD course scheduler. A fixed 684×660 hero over a live WebGL sunset
 * shader: four "how it works" feature panels cascade like a card fan,
 * floating course cards drift beneath a big Sol. wordmark, flanked by a
 * role card and a design-language card. Rebuilt from the handoff; the
 * data-driven course cards / steppers are React components (not data-*
 * mounters) and the window chrome comes from the desktop shell.
 * ------------------------------------------------------------------ */

const CREAM = "#fff5e8";

const v = (props: Record<string, string | number>) => props as CSSProperties;

const STEP_LABELS = [
    "Upload your Audit",
    "Select Your Gen Eds",
    "Select Your Registration Date",
    "Confirm Your Schedule"
];

function SolStepper({ activeStep, theme }: { activeStep: number; theme: "brown" | "teal" }) {
    const on = theme === "teal" ? "var(--sky)" : "var(--sand)";
    return (
        <div className={styles.stepper}>
            {STEP_LABELS.map((label, index) => {
                const step = index + 1;
                const filled = step <= activeStep;
                const isActive = step === activeStep;
                return (
                    <div key={label} className={styles.seg}>
                        <div className={styles.bar}>
                            <i className={styles.barFill} style={{ width: filled ? "100%" : "0%", background: on }} />
                        </div>
                        <div className={styles.lbl} style={{ color: on, opacity: isActive ? 1 : 0 }}>
                            {isActive ? label : " "}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function starRow(rating: number) {
    const rounded = Math.max(0, Math.min(5, Math.round(rating * 2) / 2));
    let out = "";
    for (let i = 0; i < 5; i++) {
        if (i + 1 <= rounded) out += "★";
        else if (i + 0.5 === rounded) out += "⯪";
        else out += "☆";
    }
    return out;
}

function SolCourseCard({
    course,
    professor,
    rating,
    className,
    style
}: {
    course: string;
    professor: string;
    rating: number;
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <div className={`${styles.courseCard} ${className ?? ""}`} style={style}>
            <div className={styles.ccRow}>
                <p className={styles.ccProf}>{professor}</p>
                <div className={styles.ccStars}>{starRow(rating)}</div>
            </div>
            <p className={styles.ccCode}>{course}</p>
        </div>
    );
}

const PANELS = [
    {
        theme: "brown" as const,
        step: 1,
        style: { width: 220, top: 58, left: 14, zIndex: 2, transform: "rotate(-6deg)" },
        head: "Stop managing spreadsheets, start managing your course load.",
        body: "Parses your degree audit into a semester-by-semester roadmap."
    },
    {
        theme: "brown" as const,
        step: 2,
        style: { width: 220, top: 90, left: 164, zIndex: 3, transform: "rotate(-2deg)" },
        head: "Find your Easy A.",
        body: "PlanetTerp ratings, GPA data and gen-ed filters in one pass."
    },
    {
        theme: "teal" as const,
        step: 3,
        style: { width: 220, top: 74, left: 314, zIndex: 4, transform: "rotate(3deg)" },
        head: "Worried about a popular class? Luna's got you.",
        body: "Predicts seat-release odds from years of registration data."
    },
    {
        theme: "brown" as const,
        step: 4,
        style: { width: 220, top: 106, left: 464, zIndex: 5, transform: "rotate(7deg)" },
        head: "Let's find your time.",
        body: "Generates full-week layouts, ranked by your preferences."
    }
];

const FLOAT_CARDS = [
    { course: "BMGT 110", professor: "Miller, Jeff", rating: 3.98, w: 172, top: 355, left: 54, z: 2, r: "-7deg", dur: "8.6s", delay: ".4s" },
    { course: "ECON 305", professor: "Vincent, Daniel", rating: 3.13, w: 168, top: 455, left: 29, z: 1, r: "4deg", dur: "9s", delay: ".7s" },
    { course: "PHYS 260", professor: "Shawhan, Peter", rating: 3.79, w: 174, top: 357, left: 479, z: 2, r: "7deg", dur: "9.2s", delay: ".6s" }
];

export default function Sol({ roleCard, designLanguageCard }: DesignCardProps) {
    return (
        <DesignStage
            width={684}
            height={660}
            className={styles.root}
            letterbox={CREAM}
            behind={<SolShader className={styles.shaderBg} />}
        >
            {/* filmstrip feature panels */}
            {PANELS.map((panel, idx) => (
                <div
                    key={panel.step}
                    className={shared.enter}
                    style={{
                        position: "absolute",
                        ...panel.style,
                        animationDelay: `${idx * 0.06}s`
                    }}
                >
                    <div
                        className={`${styles.panel} ${panel.theme === "teal" ? styles.panelTeal : styles.panelBrown}`}
                        style={{ height: "100%" }}
                    >
                        <SolStepper activeStep={panel.step} theme={panel.theme} />
                        <p className={styles.phead}>{panel.head}</p>
                        <p className={styles.pbody}>{panel.body}</p>
                    </div>
                </div>
            ))}

            {/* floating course cards */}
            {FLOAT_CARDS.map((card, idx) => (
                <div
                    key={card.course}
                    className={shared.enter}
                    style={{
                        position: "absolute",
                        left: card.left,
                        top: card.top,
                        zIndex: card.z,
                        animationDelay: `${0.25 + idx * 0.05}s`
                    }}
                >
                    <SolCourseCard
                        course={card.course}
                        professor={card.professor}
                        rating={card.rating}
                        className={styles.float}
                        style={v({
                            width: card.w,
                            "--r": card.r,
                            "--dur": card.dur,
                            "--delay": card.delay
                        })}
                    />
                </div>
            ))}

            {/* center wordmark */}
            <div
                className={shared.enter}
                style={{
                    position: "absolute",
                    top: 340,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 3,
                    animationDelay: ".08s"
                }}
            >
                <div
                    className={styles.float}
                    style={v({
                        textAlign: "center",
                        "--amp": "-8px",
                        "--dur": "9.5s"
                    })}
                >
                    <p className={styles.word} style={{ fontSize: 72 }}>
                        Sol.
                    </p>
                    <p className={styles.sub} style={{ fontSize: 20, marginTop: 6 }}>
                        Schedule of Classes, Simplified.
                    </p>
                </div>
            </div>

            {/* role card */}
            <div
                className={shared.enter}
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: 26,
                    zIndex: 7,
                    animationDelay: ".42s"
                }}
            >
                <div
                    className={`${styles.card} ${styles.float}`}
                    style={v({
                        width: 230,
                        "--r": "-1deg",
                        "--amp": "-6px",
                        "--dur": "10.5s",
                        "--delay": ".4s"
                    })}
                >
                    <div className={styles.meta}>
                        <div className={styles.k}>role</div>
                        <div>{roleCard.role}</div>
                        <div className={styles.k}>year</div>
                        <div>{roleCard.year}</div>
                        <div className={styles.k}>stack</div>
                        <div>{roleCard.stack}</div>
                    </div>
                    <div className={styles.tags}>
                        {roleCard.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className={styles.links}>
                        {roleCard.linkHref ? (
                            <a className={styles.link} href={roleCard.linkHref} target="_blank" rel="noreferrer">
                                {roleCard.linkText}
                            </a>
                        ) : roleCard.linkText ? (
                            <span className={styles.link}>{roleCard.linkText}</span>
                        ) : null}
                        {roleCard.figmaLinkHref ? (
                            <a className={styles.link} href={roleCard.figmaLinkHref} target="_blank" rel="noreferrer">
                                {roleCard.figmaLinkText || "Figma →"}
                            </a>
                        ) : roleCard.figmaLinkText ? (
                            <span className={styles.link}>{roleCard.figmaLinkText}</span>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* design-language card */}
            <div
                className={shared.enter}
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 26,
                    zIndex: 7,
                    animationDelay: ".48s"
                }}
            >
                <div
                    className={`${styles.langCard} ${styles.float}`}
                    style={v({
                        width: 300,
                        "--r": "1deg",
                        "--amp": "-6px",
                        "--dur": "11.5s",
                        "--delay": ".7s"
                    })}
                >
                    <div className={styles.sws}>
                        {designLanguageCard.swatches.map((color, idx) => (
                            <span key={idx} style={{ background: color }} />
                        ))}
                    </div>
                    <div>
                        <div className={styles.k}>design language</div>
                        <div>{designLanguageCard.description}</div>
                    </div>
                </div>
            </div>
        </DesignStage>
    );
}
