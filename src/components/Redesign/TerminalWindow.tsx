"use client";

import { useEffect, useRef } from "react";
import { claudeBioStream, niceTryJokes } from "@/stores/abirOsContent";
import { getAssetPath } from "@/utils/paths";
import styles from "./DesktopSection.module.css";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
    );

interface StreamOptions {
    cancelled: () => boolean;
    cps: number;
    scrollEl: HTMLElement;
}

async function streamHTML(target: HTMLElement, html: string, { cancelled, cps, scrollEl }: StreamOptions) {
    const tokens: Array<{ tag?: string; ch?: string }> = [];
    const tokenRe = /(<[^>]+>)|([^<]+)/g;
    let match: RegExpExecArray | null;
    while ((match = tokenRe.exec(html))) {
        if (match[1]) {
            tokens.push({ tag: match[1] });
        } else {
            for (const ch of match[2]) tokens.push({ ch });
        }
    }

    let buf = "";
    for (const token of tokens) {
        if (cancelled()) return;
        buf += token.tag ?? token.ch ?? "";
        target.innerHTML = `${buf}<span class="${styles.ccCursor}"></span>`;
        scrollEl.scrollTop = scrollEl.scrollHeight;
        if (token.ch) await sleep((1000 / cps) * (0.5 + Math.random()));
    }
    target.innerHTML = buf;
    scrollEl.scrollTop = scrollEl.scrollHeight;
}

async function runThinking(target: HTMLElement, label: string, ms: number, cancelled: () => boolean) {
    const frames = ["✻", "✺", "✹", "✸", "✷", "✶"];
    const start = Date.now();
    let i = 0;
    while (Date.now() - start < ms) {
        if (cancelled()) return;
        target.textContent = `${frames[i % frames.length]} ${label}`;
        i += 1;
        await sleep(120);
    }
}

const TerminalWindow = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const termRef = useRef<HTMLDivElement>(null);
    const startedRef = useRef(false);
    const lastJokeIdxRef = useRef<number>(-1);

    const pickJoke = () => {
        if (niceTryJokes.length === 1) return niceTryJokes[0];
        let idx = Math.floor(Math.random() * niceTryJokes.length);
        if (idx === lastJokeIdxRef.current) {
            idx = (idx + 1) % niceTryJokes.length;
        }
        lastJokeIdxRef.current = idx;
        return niceTryJokes[idx];
    };

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const scrollEl = scrollRef.current;
        const termEl = termRef.current;
        if (!scrollEl || !termEl) return;

        let cancelled = false;
        const isCancelled = () => cancelled;
        let activeInput: HTMLElement | null = null;

        const append = (className: string) => {
            const el = document.createElement("div");
            el.className = className;
            scrollEl.appendChild(el);
            return el;
        };

        const focusActiveInput = () => {
            if (!activeInput) return;
            activeInput.focus();
            const range = document.createRange();
            range.selectNodeContents(activeInput);
            range.collapse(false);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
        };

        // Clicking anywhere in the terminal body focuses the live prompt.
        const handleTermClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest("a, button, [contenteditable='true']")) return;
            focusActiveInput();
        };
        termEl.addEventListener("mousedown", handleTermClick);

        const mountPrompt = () => {
            const line = document.createElement("div");
            line.className = `${styles.ccPromptLine} ${styles.ccInputLine}`;
            line.innerHTML = `<span class="${styles.ccArrow}">&gt;</span> <span class="${styles.ccInput}" contenteditable="true" spellcheck="false" data-empty="1"></span><span class="${styles.ccCursor} ${styles.ccCursorBlock}"></span>`;
            scrollEl.appendChild(line);
            scrollEl.scrollTop = scrollEl.scrollHeight;

            const input = line.querySelector(`.${styles.ccInput}`) as HTMLElement | null;
            const cursor = line.querySelector(`.${styles.ccCursor}`) as HTMLElement | null;
            if (!input) return;
            activeInput = input;

            setTimeout(focusActiveInput, 50);

            input.addEventListener("focus", () => {
                if (cursor) cursor.style.display = "none";
            });
            input.addEventListener("blur", () => {
                if (cursor) cursor.style.display = "";
            });

            const updateEmpty = () => {
                const isEmpty = (input.textContent || "").length === 0;
                if (isEmpty) input.setAttribute("data-empty", "1");
                else input.removeAttribute("data-empty");
            };

            input.addEventListener("input", updateEmpty);

            input.addEventListener("keydown", (event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                const value = (input.textContent || "").trim();
                if (!value) return;
                activeInput = null;
                line.className = styles.ccPromptLine;
                line.innerHTML = `<span class="${styles.ccArrow}">&gt;</span> ${escapeHtml(value)}`;
                void respond(value);
            });
        };

        const respond = async (value: string) => {
            await sleep(260);
            if (cancelled) return;
            const isSlash = value.startsWith("/");
            const thinkEl = append(styles.ccThink);
            await runThinking(thinkEl, "Pretending to think…", 900, isCancelled);
            if (cancelled) return;
            thinkEl.remove();

            const resp = document.createElement("div");
            resp.className = styles.ccResp;
            resp.innerHTML = `<span class="${styles.ccRespDot}">⏺</span><span class="${styles.ccRespText}"></span>`;
            scrollEl.appendChild(resp);
            const respText = resp.querySelector(`.${styles.ccRespText}`) as HTMLElement;

            const joke = isSlash
                ? `nice try — <span class="${styles.ccPath}">${escapeHtml(value)}</span> isn't wired up. nothing here is.`
                : pickJoke();

            await streamHTML(respText, `<b>Nice try.</b> ${joke}`, { cancelled: isCancelled, cps: 280, scrollEl });
            if (cancelled) return;
            await sleep(180);

            const tip = append(styles.ccCont);
            tip.style.color = "#8a857c";
            await streamHTML(
                tip,
                `(want the real thing? <span class="${styles.ccPath}">open a folder on the desktop</span> — that's all true.)`,
                { cancelled: isCancelled, cps: 300, scrollEl }
            );
            if (cancelled) return;
            await sleep(280);
            mountPrompt();
        };

        const run = async () => {
            // welcome banner
            const banner = document.createElement("div");
            banner.className = styles.ccBanner;
            const burstSrc = getAssetPath("/Personal Website/assets/claude-burst.png");
            banner.innerHTML = `
                <div class="${styles.ccBannerTop}"><img src="${burstSrc}" alt=""> Welcome to Claude Code</div>
                <div class="${styles.ccBannerSub}"><b>/help</b> for help &nbsp;·&nbsp; <b>/status</b> for your setup</div>
                <div class="${styles.ccBannerSub}">cwd: /home/abir</div>
            `;
            scrollEl.appendChild(banner);
            scrollEl.scrollTop = scrollEl.scrollHeight;
            await sleep(550);
            if (cancelled) return;

            const userLine = append(`${styles.ccLine} ${styles.ccUser}`);
            userLine.innerHTML = `<span class="${styles.ccArrow}">&gt;</span> `;
            const userTxt = document.createElement("span");
            userLine.appendChild(userTxt);
            await streamHTML(userTxt, claudeBioStream.question, { cancelled: isCancelled, cps: 26, scrollEl });
            if (cancelled) return;
            await sleep(420);

            const thinkEl = append(styles.ccThink);
            await runThinking(thinkEl, "Thinking…", 1250, isCancelled);
            if (cancelled) return;
            thinkEl.remove();

            const tool = append(styles.ccTool);
            tool.innerHTML = `<span class="${styles.ccToolDot}">⏺</span> ${claudeBioStream.toolCall.tool}(<span class="${styles.ccPath}">${claudeBioStream.toolCall.arg}</span>)`;
            scrollEl.scrollTop = scrollEl.scrollHeight;
            await sleep(300);

            const toolRes = append(styles.ccToolRes);
            toolRes.textContent = `  ⎿  Read ${claudeBioStream.toolCall.lines} lines`;
            scrollEl.scrollTop = scrollEl.scrollHeight;
            await sleep(650);
            if (cancelled) return;

            // streamed paragraphs
            for (let i = 0; i < claudeBioStream.paragraphs.length; i += 1) {
                if (cancelled) return;
                const paragraph = claudeBioStream.paragraphs[i];
                if (i === 0) {
                    const resp = document.createElement("div");
                    resp.className = styles.ccResp;
                    resp.innerHTML = `<span class="${styles.ccRespDot}">⏺</span><span class="${styles.ccRespText}"></span>`;
                    scrollEl.appendChild(resp);
                    const respText = resp.querySelector(`.${styles.ccRespText}`) as HTMLElement;
                    await streamHTML(respText, paragraph, { cancelled: isCancelled, cps: 260, scrollEl });
                } else {
                    const cont = append(styles.ccCont);
                    await streamHTML(cont, paragraph, { cancelled: isCancelled, cps: 260, scrollEl });
                }
                await sleep(260);
            }
            if (cancelled) return;
            await sleep(140);
            mountPrompt();
        };

        void run();

        return () => {
            cancelled = true;
            termEl.removeEventListener("mousedown", handleTermClick);
            // Clear out content so a remount starts fresh
            if (scrollEl) scrollEl.innerHTML = "";
            startedRef.current = false;
        };
    }, []);

    return (
        <div ref={termRef} className={styles.term}>
            <div ref={scrollRef} className={styles.termScroll} />
        </div>
    );
};

export default TerminalWindow;
