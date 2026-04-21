"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAssetPath } from "@/utils/paths";
import {
    createCharacterRevealVariants,
    createPopVariants,
    createPosterCardRevealVariants,
    createSlideFadeVariants,
    createStaggerParent,
    inViewOnce
} from "./motionPresets";
import { defaultPosters, type PosterCardData } from "./posters";

export interface BioSectionProps {
    className?: string;
    posters?: readonly PosterCardData[];
}

const cn = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");

const actionIconClassName = "h-3.5 w-3.5";

interface ClaudeTextSegment {
    text: string;
    emphasized?: boolean;
}

const claudeResponseParagraphs: ReadonlyArray<ReadonlyArray<ClaudeTextSegment>> = [
    [
        { text: "He is a " },
        { text: "CS student", emphasized: true },
        { text: " at the University of Maryland, College Park (Class of 2028). He works as a software engineer at " },
        { text: "App Dev Club", emphasized: true },
        { text: " with " },
        { text: "Mitsubishi Electric", emphasized: true },
        { text: ", and does research at " },
        { text: "Princeton", emphasized: true },
        { text: " on tumor segmentation with Detectron2 and multimodal imaging." }
    ],
    [{ text: "Outside of that, he is an avid Nintendo fan, likes watching anime, and follows cricket." }],
    [{ text: "Were you testing me, or did you want me to pull up something specific?" }]
];

interface IndexedClaudeTextSegment extends ClaudeTextSegment {
    characters: ReadonlyArray<{ value: string; index: number }>;
}

const indexedClaudeResponseParagraphs: ReadonlyArray<ReadonlyArray<IndexedClaudeTextSegment>> = (() => {
    let nextCharacterIndex = 0;

    return claudeResponseParagraphs.map((paragraph) =>
        paragraph.map((segment) => ({
            ...segment,
            characters: Array.from(segment.text).map((value) => ({ value, index: nextCharacterIndex++ }))
        }))
    );
})();

const totalClaudeCharacterCount = indexedClaudeResponseParagraphs.reduce(
    (total, paragraph) => total + paragraph.reduce((paragraphTotal, segment) => paragraphTotal + segment.characters.length, 0),
    0
);

type FeedbackVote = "up" | "down" | null;
type CopyState = "idle" | "copied" | "error";

const BioSection = ({ className, posters = defaultPosters }: BioSectionProps) => {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const [feedbackVote, setFeedbackVote] = useState<FeedbackVote>(null);
    const [copyState, setCopyState] = useState<CopyState>("idle");
    const [typingRun, setTypingRun] = useState(0);
    const copyResetTimerRef = useRef<number | null>(null);

    const claudeResponseText = useMemo(
        () => claudeResponseParagraphs.map((paragraph) => paragraph.map((segment) => segment.text).join("")).join("\n\n"),
        []
    );

    const introBubbleVariants = createSlideFadeVariants(prefersReducedMotion, {
        axis: "x",
        offset: 20,
        duration: 0.36
    });
    const statusVariants = createSlideFadeVariants(prefersReducedMotion, {
        axis: "y",
        offset: 10,
        duration: 0.34,
        delay: prefersReducedMotion ? 0.04 : 0.15
    });
    const bodyWrapperVariants = createSlideFadeVariants(prefersReducedMotion, {
        axis: "y",
        offset: 12,
        duration: 0.38,
        delay: prefersReducedMotion ? 0.08 : 0.28
    });
    const chatCardVariants = createPopVariants(prefersReducedMotion, {
        duration: 0.44,
        delay: prefersReducedMotion ? 0 : 0.06
    });
    const typingStartDelay = prefersReducedMotion ? 0.05 : 0.48;
    const typingStepDelay = prefersReducedMotion ? 0 : 0.0085;
    const characterVariants = createCharacterRevealVariants(prefersReducedMotion, typingStartDelay, typingStepDelay);
    const controlsDelay = prefersReducedMotion ? 0.14 : typingStartDelay + totalClaudeCharacterCount * typingStepDelay + 0.22;
    const controlsVariants = createSlideFadeVariants(prefersReducedMotion, {
        axis: "y",
        offset: 8,
        duration: 0.32,
        delay: controlsDelay
    });
    const burstVariants = createPopVariants(prefersReducedMotion, {
        duration: 0.28,
        delay: controlsDelay + (prefersReducedMotion ? 0.05 : 0.12)
    });
    const posterGridVariants = createStaggerParent(prefersReducedMotion, 0.06, prefersReducedMotion ? 0 : 0.14);
    const posterCardVariants = createPosterCardRevealVariants(prefersReducedMotion);

    useEffect(() => {
        return () => {
            if (copyResetTimerRef.current) {
                window.clearTimeout(copyResetTimerRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        if (!navigator.clipboard) {
            setCopyState("error");
            return;
        }

        try {
            await navigator.clipboard.writeText(claudeResponseText);
            setCopyState("copied");
        } catch {
            setCopyState("error");
        }

        if (copyResetTimerRef.current) {
            window.clearTimeout(copyResetTimerRef.current);
        }
        copyResetTimerRef.current = window.setTimeout(() => setCopyState("idle"), 1600);
    };

    const handleLiked = () => {
        setFeedbackVote((currentVote) => (currentVote === "up" ? null : "up"));
    };

    const handleDisliked = () => {
        setFeedbackVote((currentVote) => (currentVote === "down" ? null : "down"));
    };

    const handleReload = () => {
        setCopyState("idle");
        setTypingRun((currentRun) => currentRun + 1);
    };

    return (
        <section
            className={cn("flex min-h-screen flex-col justify-center gap-12 bg-[#0f0f10] px-4 py-12 text-[#EDEDF0] sm:px-8 lg:px-12", className)}
            aria-label="bio and poster section"
        >
            <div className="mx-auto w-full max-w-2xl">
                <motion.article
                    aria-label="who is abir modak chat card"
                    variants={chatCardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={inViewOnce}
                >
                    <div className="flex flex-col gap-8">
                        <motion.div
                            className="ml-auto max-w-[75%] rounded-full bg-[#2a2a30] px-4 py-2 text-sm"
                            variants={introBubbleVariants}
                        >
                            who is abir modak?
                        </motion.div>

                        <motion.div className="text-[13px] text-[#7f7f85]" variants={statusVariants}>
                            Reconciled identity query with contextual memory ❯
                        </motion.div>

                        <motion.div key={`typed-sequence-${typingRun}`} initial="hidden" whileInView="visible" viewport={inViewOnce} className="flex flex-col gap-8">
                            <motion.div
                                className="space-y-4 font-serif text-[15px] leading-relaxed text-[#EDEDF0]"
                                variants={bodyWrapperVariants}
                            >
                                {indexedClaudeResponseParagraphs.map((paragraph, paragraphIndex) => (
                                    <p key={`claude-paragraph-${paragraphIndex}`}>
                                        {paragraph.map((segment, segmentIndex) => {
                                            const SegmentTag = segment.emphasized ? "b" : "span";
                                            const segmentClassName = segment.emphasized ? "font-semibold text-white" : undefined;

                                            return (
                                                <SegmentTag
                                                    key={`claude-segment-${paragraphIndex}-${segmentIndex}`}
                                                    className={segmentClassName}
                                                >
                                                    {segment.characters.map((character, characterOffset) => {
                                                        return (
                                                            <motion.span
                                                                key={`claude-char-${paragraphIndex}-${segmentIndex}-${characterOffset}`}
                                                                className="inline-block will-change-transform"
                                                                custom={character.index}
                                                                variants={characterVariants}
                                                            >
                                                                {character.value === " " ? "\u00A0" : character.value}
                                                            </motion.span>
                                                        );
                                                    })}
                                                </SegmentTag>
                                            );
                                        })}
                                    </p>
                                ))}
                            </motion.div>

                            <motion.div className="flex items-center gap-2 text-[#7f7f85]" variants={controlsVariants}>
                                <button
                                    type="button"
                                    aria-label={copyState === "copied" ? "Copied response" : "Copy response"}
                                    className={cn(
                                        "grid cursor-pointer h-8 w-8 place-items-center rounded-md border border-transparent hover:border-[#2a2a2f] hover:bg-[#1f1f22]",
                                        copyState === "copied" ? "border-[#375f4d] text-[#9bd9bc]" : undefined,
                                        copyState === "error" ? "border-[#6a3838] text-[#f0adad]" : undefined
                                    )}
                                    onClick={handleCopy}
                                >
                                    <svg className={actionIconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="12" height="12" rx="2" />
                                        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Good response"
                                    aria-pressed={feedbackVote === "up"}
                                    className={cn(
                                        "grid cursor-pointer h-8 w-8 place-items-center rounded-md border border-transparent hover:border-[#2a2a2f] hover:bg-[#1f1f22]",
                                        feedbackVote === "up" ? "border-[#375f4d] bg-[#1e2e27] text-[#9bd9bc]" : undefined
                                    )}
                                    onClick={handleLiked}
                                >
                                    <svg className={actionIconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 22V11" />
                                        <path d="M15 5.88 14 11h5.5a2 2 0 0 1 1.95 2.44l-1.5 7A2 2 0 0 1 18 22H7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Bad response"
                                    aria-pressed={feedbackVote === "down"}
                                    className={cn(
                                        "grid cursor-pointer h-8 w-8 place-items-center rounded-md border border-transparent hover:border-[#2a2a2f] hover:bg-[#1f1f22]",
                                        feedbackVote === "down" ? "border-[#6a3838] bg-[#311f22] text-[#f0adad]" : undefined
                                    )}
                                    onClick={handleDisliked}
                                >
                                    <svg className={actionIconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 2v11" />
                                        <path d="M9 18.12 10 13H4.5a2 2 0 0 1-1.95-2.44l1.5-7A2 2 0 0 1 6 2h11" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Retry"
                                    className="grid cursor-pointer h-8 w-8 place-items-center rounded-md border border-transparent hover:border-[#2a2a2f] hover:bg-[#1f1f22]"
                                    onClick={handleReload}
                                >
                                    <svg className={actionIconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 12a9 9 0 1 0 3-6.7" />
                                        <path d="M3 3v6h6" />
                                    </svg>
                                </button>
                            </motion.div>

                            <motion.div className="h-[22px] w-[22px]" aria-hidden="true" variants={burstVariants}>
                                <img src={getAssetPath("/Personal Website/assets/claude-burst.png")} alt="" className="h-full w-full" />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.article>
            </div>

            <div className="overflow-hidden md:hidden w-full">
                <motion.div
                    className="inline-flex items-center gap-4"
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ duration: 30, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                >
                    {posters.map((poster, index) => (
                        <figure key={`carousel-a-${poster.src}-${index}`} className="flex-shrink-0 w-44 aspect-[3/4] overflow-hidden rounded-lg border border-[#2a2a2f] bg-[#111]">
                            <img src={poster.src} alt={poster.alt} className="h-full w-full object-cover [filter:grayscale(.1)_contrast(1.02)]" />
                        </figure>
                    ))}
                    {posters.map((poster, index) => (
                        <figure key={`carousel-b-${poster.src}-${index}`} className="flex-shrink-0 w-44 aspect-[3/4] overflow-hidden rounded-lg border border-[#2a2a2f] bg-[#111]">
                            <img src={poster.src} alt={poster.alt} className="h-full w-full object-cover [filter:grayscale(.1)_contrast(1.02)]" />
                        </figure>
                    ))}
                </motion.div>
            </div>

            <motion.div
                className="hidden md:grid mx-auto w-full max-w-6xl grid-cols-4 gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={inViewOnce}
                variants={posterGridVariants}
            >
                {posters.map((poster, index) => (
                    <motion.figure
                        key={`${poster.src}-${poster.caption}`}
                        custom={index}
                        variants={posterCardVariants}
                        className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-[#2a2a2f] bg-[#111] transition-transform duration-200 hover:-translate-y-1 hover:border-[#555]"
                    >
                        <img src={poster.src} alt={poster.alt} className="h-full w-full object-cover [filter:grayscale(.1)_contrast(1.02)]" />
                        <figcaption className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {poster.caption}
                        </figcaption>
                    </motion.figure>
                ))}
            </motion.div>
        </section>
    );
};

export default BioSection;
