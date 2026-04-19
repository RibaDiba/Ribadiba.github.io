"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
    createAlternatingRowRevealVariants,
    createPopVariants,
    createSlideFadeVariants,
    inViewOnce
} from "./motionPresets";

export interface HeroWordmarkRow {
    word: string;
    tone?: "primary" | "muted";
}

export interface HeroSectionProps {
    className?: string;
    topbarText?: string;
    modeText?: string;
    noteText?: string;
    rows?: readonly HeroWordmarkRow[];
    repeatCount?: number;
}

const defaultRows: readonly HeroWordmarkRow[] = [
    { word: "RIBA", tone: "muted" },
    { word: "ABIR", tone: "primary" },
    { word: "RIBA", tone: "muted" },
    { word: "ABIR", tone: "primary" },
    { word: "RIBA", tone: "muted" },
    { word: "ABIR", tone: "primary" },
    { word: "RIBA", tone: "muted" },
    { word: "ABIR", tone: "primary" }
];

const cn = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");

const renderWordTokens = (word: string, repeatCount: number) =>
    Array.from({ length: repeatCount }, (_, index) => (
        <span key={`${word}-${index}`} className="inline-flex items-center">
            <span>{word}</span>
            {index < repeatCount - 1 ? <span className="mx-1 opacity-35">·</span> : null}
        </span>
    ));

const HeroSection = ({
    className,
    rows,
    repeatCount = 9
}: HeroSectionProps) => {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const rowsToRender = rows && rows.length > 0 ? rows : defaultRows;
    const safeRepeatCount = Number.isFinite(repeatCount) ? Math.min(24, Math.max(1, Math.floor(repeatCount))) : 9;
    const topbarVariants = createSlideFadeVariants(prefersReducedMotion, {
        axis: "y",
        offset: 14,
        duration: 0.34
    });
    const noteVariants = createPopVariants(prefersReducedMotion, {
        delay: prefersReducedMotion ? 0.06 : 0.24
    });
    const rowVariants = createAlternatingRowRevealVariants(prefersReducedMotion);

    return (
        <section
            className={cn("relative min-h-screen overflow-hidden px-4 py-8 text-[#E9E9EC] sm:px-8 lg:px-12", className)}
            style={{
                background:
                    "radial-gradient(1200px 600px at 20% -10%, #1a1a1d 0%, transparent 60%), radial-gradient(800px 400px at 110% 20%, #141416 0%, transparent 50%), #0f0f10"
            }}
            aria-label="hero section"
        >
            <motion.a
                href="#projects"
                onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                variants={createSlideFadeVariants(prefersReducedMotion, { axis: "y", offset: 16, duration: 0.4, delay: 0.6 })}
                initial="hidden"
                animate="visible"
                className="absolute bottom-8 left-8 z-20 flex flex-col items-center gap-2 rounded-xl px-5 py-4 text-[#E9E9EC]/70 hover:text-[#E9E9EC] transition-colors cursor-pointer"
                style={{ backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.06)" }}
                aria-label="Scroll to projects"
            >
                <span className="font-mono text-[13px] uppercase tracking-[0.2em]">projects</span>
                <motion.span
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                    className="text-xl leading-none"
                >
                    ↓
                </motion.span>
            </motion.a>
            <div className="relative flex h-[calc(100vh-7rem)] min-h-[420px] flex-col justify-between overflow-hidden pb-2 pt-4">
                {rowsToRender.map((row, index) => (
                    <motion.p
                        key={`${row.word}-${index}`}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={inViewOnce}
                        className={cn(
                            "whitespace-nowrap text-[clamp(2rem,9vw,7.5rem)] font-black italic leading-[1] tracking-[-0.01em]",
                            row.tone === "muted" ? "text-[#4A4A4F]" : "text-[#EDEDF0]"
                        )}
                    >
                        {renderWordTokens(row.word, safeRepeatCount)}
                    </motion.p>
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
