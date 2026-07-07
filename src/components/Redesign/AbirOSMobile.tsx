"use client";

import { useEffect, useState } from "react";
import {
    retroDesktopPortfolioNodes,
    type PortfolioFileNode,
    type PortfolioFolderNode
} from "@/stores/RetroDesktopPortfolio";
import { claudeBioStream, readmeMarkup } from "@/stores/abirOsContent";
import { getAssetPath } from "@/utils/paths";

const folderNodes = retroDesktopPortfolioNodes.filter(
    (node): node is PortfolioFolderNode => node.kind === "folder"
);

const toLinkHref = (value: string) => {
    const normalized = value.replace(/\s*→\s*$/, "").trim();
    if (!normalized) return null;
    if (/^https?:\/\//i.test(normalized)) return normalized;
    if (/^([\w-]+\.)+[a-z]{2,63}(?:[/:?#].*)?$/i.test(normalized)) return `https://${normalized}`;
    return null;
};

import type { ProjectSheetProps } from "@/interfaces/mobile";

const SheetShell = ({
    label,
    onClose,
    children,
    bodyClassName
}: {
    label: string;
    onClose: () => void;
    children: React.ReactNode;
    bodyClassName?: string;
}) => {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-0"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className={`max-h-[88vh] w-full overflow-y-auto rounded-t-xl border-2 border-[#1a1a1a] bg-[#efece0] p-4 pb-8 text-[#1a1a1a] shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.7)] ${bodyClassName ?? ""}`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#5a5a5a]">{label}</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border border-[#1a1a1a] bg-[#c8c4b8] px-2 py-1 font-mono text-[10px] uppercase tracking-widest hover:bg-[#d97a2a] hover:text-white"
                    >
                        close ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const ProjectSheet = ({ file, onClose }: ProjectSheetProps) => {
    if (file.fileType === "design") {
        const DesignComponent = file.component;
        return (
            <SheetShell label={file.label} onClose={onClose}>
                <div className="h-[62vh] overflow-hidden border-2 border-[#1a1a1a] bg-[#efece0]">
                    <DesignComponent roleCard={file.roleCard} designLanguageCard={file.designLanguageCard} />
                </div>
            </SheetShell>
        );
    }

    const data = file.data;
    const link = toLinkHref(data.link);
    const previewSrc = data.previewImage ? getAssetPath(data.previewImage.src) : null;

    return (
        <SheetShell label={file.label} onClose={onClose}>
            <>
                {previewSrc ? (
                    <div className="mb-4 overflow-hidden border-2 border-[#1a1a1a] bg-[#fff]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewSrc} alt={data.previewImage?.alt ?? data.title} className="block w-full" />
                    </div>
                ) : null}
                <h3 className="mb-2 border-b border-[#7a7668] pb-2 font-sans text-lg font-bold">{data.title}</h3>
                <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-[11px]">
                    <dt className="uppercase tracking-wider text-[#5a5a5a]">role</dt>
                    <dd>{data.role}</dd>
                    <dt className="uppercase tracking-wider text-[#5a5a5a]">year</dt>
                    <dd>{data.year}</dd>
                    <dt className="uppercase tracking-wider text-[#5a5a5a]">stack</dt>
                    <dd>{data.stack.join(", ")}</dd>
                </dl>
                <p className="mb-2 font-mono text-[12px] leading-relaxed">{data.blurb}</p>
                {data.notes ? <p className="mb-3 font-mono text-[11px] italic leading-relaxed text-[#3a3a3a]">{data.notes}</p> : null}
                {data.tags.length > 0 ? (
                    <div className="mb-3 flex flex-wrap gap-1">
                        {data.tags.map((tag) => (
                            <span
                                key={tag}
                                className="border border-[#1a1a1a] bg-white px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider shadow-[2px_2px_0_rgba(0,0,0,0.2)]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}
                {link ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block font-mono text-[12px] text-[#0055aa] underline"
                    >
                        {data.link}
                    </a>
                ) : data.link ? (
                    <p className="font-mono text-[11px] text-[#555148]">{data.link}</p>
                ) : null}
            </>
        </SheetShell>
    );
};

const AbirOSMobile = () => {
    const [openFolderId, setOpenFolderId] = useState<string | null>(null);
    const [openFile, setOpenFile] = useState<PortfolioFileNode | null>(null);

    return (
        <main
            className="relative min-h-screen w-full overflow-x-hidden text-[var(--abir-ink)]"
            style={{ fontFamily: "var(--abir-sans)" }}
        >
            {/* faint wordmark band */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-0 flex select-none flex-col gap-3 overflow-hidden pt-6 opacity-90"
            >
                <div
                    className="whitespace-nowrap text-center italic"
                    style={{
                        fontFamily: "var(--abir-disp)",
                        fontSize: "18vw",
                        lineHeight: 0.9,
                        letterSpacing: "-0.01em",
                        transform: "skewX(-6deg)",
                        WebkitTextStroke: "1px rgba(255,255,255,0.05)",
                        color: "transparent"
                    }}
                >
                    ABIR · RIBA
                </div>
            </div>

            <div className="relative z-10 mx-auto flex max-w-md flex-col gap-6 px-4 pb-14 pt-12">
                <header className="flex items-center justify-between">
                    <span
                        className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60"
                        style={{ fontFamily: "var(--abir-mono)" }}
                    >
                        abir_os · v3
                    </span>
                    <span
                        className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40"
                        style={{ fontFamily: "var(--abir-mono)" }}
                    >
                        tap to explore
                    </span>
                </header>

                {/* terminal-style bio card */}
                <section
                    className="overflow-hidden rounded-md border border-[#2a2a2f] bg-[#0b0b0c] p-3 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)]"
                    style={{ fontFamily: "var(--abir-term)" }}
                >
                    <div className="mb-3 flex items-center gap-2 rounded border border-[var(--abir-accent)] px-2.5 py-2 text-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getAssetPath("/Personal Website/assets/claude-burst.png")}
                            alt=""
                            className="h-[14px] w-[14px]"
                        />
                        <span className="text-[12px] font-medium">Welcome to Claude Code</span>
                    </div>
                    <div className="space-y-2 text-[12.5px] leading-[1.55] text-[#d8d4cc]">
                        <div className="text-white">
                            <span style={{ color: "var(--abir-accent)" }}>&gt;</span> {claudeBioStream.question}
                        </div>
                        <div className="text-[#cfcbc2]">
                            <span style={{ color: "var(--abir-accent)" }}>⏺</span>{" "}
                            {claudeBioStream.toolCall.tool}(<span className="text-[#7aa2ff]">{claudeBioStream.toolCall.arg}</span>)
                        </div>
                        <div className="text-[#8a857c]">  ⎿  Read {claudeBioStream.toolCall.lines} lines</div>
                        {claudeBioStream.paragraphs.map((paragraph, index) => (
                            <div
                                key={index}
                                className={index === 0 ? "flex gap-2 pt-1 text-[#e4e0d8]" : "ml-5 pt-1 text-[#e4e0d8]"}
                            >
                                {index === 0 ? <span style={{ color: "var(--abir-accent)", flexShrink: 0 }}>⏺</span> : null}
                                <span dangerouslySetInnerHTML={{ __html: paragraph }} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* folder list */}
                <section className="flex flex-col gap-2">
                    <span
                        className="px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40"
                        style={{ fontFamily: "var(--abir-mono)" }}
                    >
                        {"// folders"}
                    </span>
                    {folderNodes.map((folder) => {
                        const isOpen = openFolderId === folder.id;
                        return (
                            <div
                                key={folder.id}
                                className="overflow-hidden border-2 border-[#1a1a1a] bg-[#c8c4b8] shadow-[4px_4px_0_rgba(0,0,0,0.45)]"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFolderId(isOpen ? null : folder.id)}
                                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
                                    style={{ fontFamily: "var(--abir-mono)" }}
                                >
                                    <span className="flex items-center gap-2">
                                        <span
                                            className="inline-block h-4 w-5 border-2 border-[#1a1a1a]"
                                            style={{ background: "#d9b85a", boxShadow: "inset 1.5px 1.5px 0 #f0d679" }}
                                            aria-hidden="true"
                                        />
                                        <span className="text-[13px] font-bold uppercase tracking-wider text-[#1a1a1a]">
                                            {folder.label}
                                        </span>
                                    </span>
                                    <span className="font-mono text-[10px] text-[#3a3a3a]">
                                        {folder.children.length} item(s) {isOpen ? "▾" : "▸"}
                                    </span>
                                </button>
                                {isOpen ? (
                                    <ul className="flex flex-col divide-y divide-[#9a9688] border-t-2 border-[#1a1a1a] bg-[#efece0]">
                                        {folder.children.map((child) => (
                                            <li key={child.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenFile(child)}
                                                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#d9d6c8]"
                                                    style={{ fontFamily: "var(--abir-mono)" }}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span
                                                            className="inline-block h-3 w-3 rounded-sm bg-white"
                                                            style={{
                                                                background:
                                                                    child.fileType === "code"
                                                                        ? "#1a1a1a"
                                                                        : child.fileType === "img"
                                                                          ? "#f0e8d4"
                                                                          : "#ffffff",
                                                                border: "1.5px solid #1a1a1a"
                                                            }}
                                                            aria-hidden="true"
                                                        />
                                                        <span className="text-[12px] font-medium text-[#1a1a1a]">
                                                            {child.label}
                                                        </span>
                                                    </span>
                                                    <span className="font-mono text-[10px] text-[#5a5a5a]">
                                                        {child.fileType !== "design" ? child.data.year : null}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        );
                    })}
                </section>

                {/* readme block */}
                <section
                    className="overflow-hidden rounded-sm border-2 border-[#1a1a1a] bg-[#fffef8] p-4 text-[#1a1a1a] shadow-[4px_4px_0_rgba(0,0,0,0.45)]"
                    style={{ fontFamily: "var(--abir-mono)" }}
                >
                    <div
                        className="whitespace-pre-wrap text-[12px] leading-[1.7]"
                        style={{ fontFamily: "var(--abir-mono)" }}
                        dangerouslySetInnerHTML={{
                            __html: readmeMarkup.replace(
                                /<span class="hl">/g,
                                '<span style="color: var(--abir-accent); font-weight: 700;">'
                            )
                        }}
                    />
                </section>

                <footer
                    className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/30"
                    style={{ fontFamily: "var(--abir-mono)" }}
                >
                    — abir_os · v3 —
                </footer>
            </div>

            {openFile ? <ProjectSheet file={openFile} onClose={() => setOpenFile(null)} /> : null}
        </main>
    );
};

export default AbirOSMobile;
