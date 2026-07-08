"use client";

import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    retroDesktopPortfolioNodes,
    type DesignCardProps,
    type PortfolioDesktopNode,
    type PortfolioFileNode,
    type PortfolioFileType,
    type PortfolioFolderNode,
    type PortfolioMediaAsset,
    type PortfolioStandardFileNode
} from "@/stores/RetroDesktopPortfolio";
import type {
    DragState,
    FileWindow,
    FolderWindow,
    ImageWindow,
    NotepadLauncherWindow,
    OpenWindow,
    ResizeDirection,
    ResizeState,
    RetroIconVariant,
    RetroNodeIconProps,
    TerminalLauncherWindow,
    WindowPosition,
    WindowSize,
} from "@/interfaces/desktop";
import { getAssetPath } from "@/utils/paths";
import ReadmeNotepad from "./ReadmeNotepad";
import StartMenu from "./StartMenu";
import TerminalWindow from "./TerminalWindow";
import styles from "./DesktopSection.module.css";

const TERMINAL_WINDOW_ID = "terminal";
const NOTEPAD_WINDOW_ID = "notepad";

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

const retroFileVariantClasses: Record<PortfolioFileType, string> = {
    img: styles.iconFileImg,
    code: styles.iconFileCode,
    paper: styles.iconFilePaper,
    game: styles.iconFileCode,
    design: styles.iconFileDesign
};

const getNodeIconVariant = (node: PortfolioDesktopNode | PortfolioFileNode): RetroIconVariant => {
    if (node.kind === "folder") return "folder";
    return node.fileType;
};

const getGithubRepoInfo = (url: string) => {
    try {
        const path = url.replace("https://github.com/", "");
        const parts = path.split("/");
        if (parts.length >= 2) {
            return {
                owner: parts[0],
                repo: parts[1]
            };
        }
    } catch (e) {}
    return null;
};

const createWindowPosition = (index: number): WindowPosition => ({
    x: 80 + (index * 28) % 220,
    y: 60 + (index * 22) % 140
});

const nextZIndex = (windows: OpenWindow[]) => (windows.length > 0 ? Math.max(...windows.map((windowItem) => windowItem.zIndex)) + 1 : 1);
const localFilePattern = /\.(pdf|txt|md|png|jpe?g|gif|webp|svg|mp4|webm|mov)(?:[?#].*)?$/i;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const MIN_WINDOW_WIDTH = 240;
const MIN_WINDOW_HEIGHT = 140;
const folderWindowSize: WindowSize = { width: 420, height: 300 };
const fileWindowSize: WindowSize = { width: 700, height: 500 };
const imageWindowSize: WindowSize = { width: 600, height: 520 };
const terminalWindowSize: WindowSize = { width: 560, height: 400 };
const notepadWindowSize: WindowSize = { width: 360, height: 360 };
const resizeHandles: ResizeDirection[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
const resizeHandleClasses: Record<ResizeDirection, string> = {
    n: styles.resizeHandleN,
    s: styles.resizeHandleS,
    e: styles.resizeHandleE,
    w: styles.resizeHandleW,
    ne: styles.resizeHandleNE,
    nw: styles.resizeHandleNW,
    se: styles.resizeHandleSE,
    sw: styles.resizeHandleSW
};

const toMediaSrc = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return null;
    if (/^https?:\/\//i.test(normalized)) return normalized;
    if (normalized.startsWith("/") || normalized.startsWith("./") || normalized.startsWith("../")) return normalized;
    if (localFilePattern.test(normalized)) return getAssetPath(normalized);
    return null;
};

const toLinkHref = (value: string) => {
    const normalized = value.replace(/\s*→\s*$/, "").trim();
    if (!normalized) return null;
    const mediaSrc = toMediaSrc(normalized);
    if (mediaSrc) return mediaSrc;
    if (/^([\w-]+\.)+[a-z]{2,63}(?:[/:?#].*)?$/i.test(normalized)) return `https://${normalized}`;
    return null;
};

const toYouTubeEmbedSrc = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

// Game Components
const SnakeGame = () => {
    const CANVAS_SIZE = 300;
    const GRID_SIZE = 15;
    const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
    const [food, setFood] = useState({ x: 3, y: 3 });
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const moveSnake = useCallback(() => {
        if (gameOver) return;
        setSnake((prev) => {
            const head = prev[0];
            const newHead = { x: head.x + direction.x, y: head.y + direction.y };

            if (
                newHead.x < 0 || newHead.x >= GRID_SIZE ||
                newHead.y < 0 || newHead.y >= GRID_SIZE ||
                prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)
            ) {
                setGameOver(true);
                return prev;
            }

            const newSnake = [newHead, ...prev];
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore(s => s + 10);
                setFood({
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE)
                });
            } else {
                newSnake.pop();
            }
            return newSnake;
        });
    }, [direction, food, gameOver]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const isArrow = ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key);
            const isWASD = ["w", "a", "s", "d"].includes(key);

            if (isArrow || isWASD) {
                e.preventDefault();
            }

            switch (key) {
                case "arrowup":
                case "w":
                    if (direction.y === 0) setDirection({ x: 0, y: -1 });
                    break;
                case "arrowdown":
                case "s":
                    if (direction.y === 0) setDirection({ x: 0, y: 1 });
                    break;
                case "arrowleft":
                case "a":
                    if (direction.x === 0) setDirection({ x: -1, y: 0 });
                    break;
                case "arrowright":
                case "d":
                    if (direction.x === 0) setDirection({ x: 1, y: 0 });
                    break;
            }
        };
        window.addEventListener("keydown", handleKey);
        const interval = setInterval(moveSnake, 150);
        return () => {
            window.removeEventListener("keydown", handleKey);
            clearInterval(interval);
        };
    }, [moveSnake, direction]);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#efece0";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        // Grid lines
        ctx.strokeStyle = "#dbd8cc";
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath(); ctx.moveTo(i * CELL_SIZE, 0); ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i * CELL_SIZE); ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE); ctx.stroke();
        }

        // Food
        ctx.fillStyle = "#a84e0e";
        ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

        // Snake
        ctx.fillStyle = "#1a1a1a";
        snake.forEach((seg, i) => {
            if (i === 0) ctx.fillStyle = "#3a6a3a";
            else ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        });
    }, [snake, food]);

    const reset = () => {
        setSnake([{ x: 7, y: 7 }]);
        setDirection({ x: 0, y: -1 });
        setGameOver(false);
        setScore(0);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 font-mono text-xs">
            <div className="flex justify-between w-full border-b border-[#7a7668] pb-2">
                <span>SYSTEM_STATE: {gameOver ? "CRITICAL" : "ACTIVE"}</span>
                <span>PACKETS: {score}</span>
            </div>
            <div className="border-2 border-[#1a1a1a] shadow-inner bg-[#efece0] relative">
                <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} />
                {gameOver && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4 text-center">
                        <p className="font-bold text-red-500 mb-2">SYSTEM_COLLISION</p>
                        <p className="mb-4">SCORE: {score}</p>
                        <button onClick={reset} className="underline hover:text-[#ff8a3c]">REBOOT.EXE</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const GameContainer = ({ gameId }: { gameId: string }) => {
    if (gameId === "snake") return <SnakeGame />;
    return <div className="p-4 text-center">404: GAME_NOT_FOUND</div>;
};

const renderMediaAsset = (asset: PortfolioMediaAsset, index: number) => {
    if (asset.type === "image") {
        const imageSrc = toMediaSrc(asset.src);
        if (!imageSrc) {
            return (
                <figure key={`placeholder-img-${index}`} className={styles.fileDetailMediaFigure}>
                    <div className={styles.fileDetailMediaPlaceholder}>[ img · unavailable ]</div>
                    {asset.alt ? <figcaption className={styles.fileDetailMediaCaption}>{asset.alt}</figcaption> : null}
                </figure>
            );
        }

        return (
            <figure key={`${asset.src}-${index}`} className={styles.fileDetailMediaFigure}>
                <img src={imageSrc} alt={asset.alt ?? `asset ${index + 1}`} className={styles.fileDetailMediaImage} />
                {asset.alt ? <figcaption className={styles.fileDetailMediaCaption}>{asset.alt}</figcaption> : null}
            </figure>
        );
    }

    if (asset.type === "video") {
        const embedSrc = toYouTubeEmbedSrc(asset.src);
        if (embedSrc) {
            return (
                <figure key={`${asset.src}-${index}`} className={styles.fileDetailMediaFigure}>
                    <iframe
                        src={embedSrc}
                        title={asset.alt ?? `video ${index + 1}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.fileDetailMediaVideo}
                    />
                    {asset.alt ? <figcaption className={styles.fileDetailMediaCaption}>{asset.alt}</figcaption> : null}
                </figure>
            );
        }
        const videoSrc = toMediaSrc(asset.src);
        if (!videoSrc) return null;
        return <video key={`${asset.src}-${index}`} src={videoSrc} controls className={styles.fileDetailMediaVideo} />;
    }

    const documentHref = toLinkHref(asset.src);
    if (!documentHref) return <p key={`${asset.src}-${index}`} className={styles.fileDetailMediaUnavailable}>{asset.alt ?? "Document unavailable"}</p>;

    return (
        <a
            key={`${asset.src}-${index}`}
            href={documentHref}
            target="_blank"
            rel="noreferrer"
            className={styles.fileDetailMediaDocument}
        >
            Open document {index + 1}
        </a>
    );
};

const getWindowTitle = (windowItem: OpenWindow) => {
    if (windowItem.kind === "folder") return `${windowItem.label} — explorer`;
    if (windowItem.kind === "image") return `${windowItem.label} — preview`;
    if (windowItem.kind === "terminal") return "claude code — abir@umd: ~";
    if (windowItem.kind === "notepad") return "readme.txt — notepad";
    return `${windowItem.label} — properties`;
};

const getWindowStatus = (windowItem: OpenWindow): [string, string] => {
    if (windowItem.kind === "folder") return [`${windowItem.folder.children.length} item(s)`, `/abir/${windowItem.folder.label}`];
    if (windowItem.kind === "image") return ["image", windowItem.label];
    if (windowItem.kind === "terminal") return ["claude code v2", "~"];
    if (windowItem.kind === "notepad") return ["plain text", "readme.txt"];
    return ["ready", windowItem.label];
};

const RetroNodeIcon = ({ node, size }: RetroNodeIconProps) => {
    const variant = getNodeIconVariant(node);
    const iconTypeClass = variant === "folder" ? styles.iconFolder : cn(styles.iconFile, retroFileVariantClasses[variant]);
    const designIconSrc = node.kind === "file" && node.fileType === "design" ? node.iconSrc : undefined;

    return (
        <span
            aria-hidden="true"
            className={cn(styles.iconArt, size === "desktop" ? styles.desktopIconArt : styles.folderIconArt, iconTypeClass)}
        >
            {designIconSrc ? <img src={getAssetPath(designIconSrc)} alt="" className={styles.iconFileDesignImg} /> : null}
        </span>
    );
};

const DesktopSection = () => {
    const rootNodes = useMemo(() => retroDesktopPortfolioNodes, []);
    const folderNodes = useMemo(
        () => rootNodes.filter((node): node is PortfolioFolderNode => node.kind === "folder"),
        [rootNodes]
    );
    const workspaceRef = useRef<HTMLDivElement>(null);
    const hasAutoOpenedRef = useRef(false);

    const [windows, setWindows] = useState<OpenWindow[]>([]);
    const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [resizeState, setResizeState] = useState<ResizeState | null>(null);
    const [clock, setClock] = useState(() => new Date());
    const [selectedDesktopNodeId, setSelectedDesktopNodeId] = useState<string | null>(null);
    const [selectedFolderNodeIds, setSelectedFolderNodeIds] = useState<Record<string, string>>({});
    const [startMenuOpen, setStartMenuOpen] = useState(false);

    useEffect(() => {
        const intervalId = window.setInterval(() => setClock(new Date()), 1000);
        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (hasAutoOpenedRef.current) return;
        hasAutoOpenedRef.current = true;

        const timerId = window.setTimeout(() => {
            const bounds = workspaceRef.current?.getBoundingClientRect();
            const dWidth = bounds?.width ?? 1024;
            const dHeight = bounds?.height ?? 640;
            const gap = 22;

            const stack = dWidth < 760;
            const termW = stack ? Math.min(dWidth - 40, 560) : Math.min(560, Math.max(360, dWidth * 0.46));
            const termH = Math.min(420, Math.max(300, dHeight * 0.62));
            const noteW = stack ? Math.min(dWidth - 40, 360) : Math.min(360, Math.max(280, dWidth * 0.3));
            const noteH = Math.min(380, Math.max(280, dHeight * 0.56));

            let termX: number;
            let termY: number;
            let noteX: number;
            let noteY: number;
            if (stack) {
                termX = 20;
                termY = 16;
                noteX = Math.max(20, dWidth - noteW - 20);
                noteY = termH - 40;
            } else {
                const totalW = termW + gap + noteW;
                const startX = Math.max(24, (dWidth - totalW) / 2);
                termX = startX;
                termY = Math.max(20, (dHeight - termH) / 2 - 10);
                noteX = startX + termW + gap;
                noteY = Math.max(20, (dHeight - noteH) / 2 + 14);
            }

            const terminalWindow: TerminalLauncherWindow = {
                id: TERMINAL_WINDOW_ID,
                label: "claude code",
                kind: "terminal",
                position: { x: termX, y: termY },
                size: { width: termW, height: termH },
                zIndex: 2,
                minimized: false
            };
            const notepadWindow: NotepadLauncherWindow = {
                id: NOTEPAD_WINDOW_ID,
                label: "readme.txt",
                kind: "notepad",
                position: { x: noteX, y: noteY },
                size: { width: noteW, height: noteH },
                zIndex: 1,
                minimized: false
            };

            setWindows([notepadWindow, terminalWindow]);
            setFocusedWindowId(TERMINAL_WINDOW_ID);
        }, 180);

        return () => window.clearTimeout(timerId);
    }, []);

    useEffect(() => {
        if (!dragState) return;

        const handleMove = (event: MouseEvent) => {
            const workspaceBounds = workspaceRef.current?.getBoundingClientRect();
            if (!workspaceBounds) return;

            const nextX = event.clientX - workspaceBounds.left - dragState.offsetX;
            const nextY = event.clientY - workspaceBounds.top - dragState.offsetY;
            const maxX = workspaceBounds.width - 40;
            const maxY = workspaceBounds.height - 26;

            setWindows((currentWindows) =>
                currentWindows.map((windowItem) =>
                    windowItem.id === dragState.id
                        ? {
                              ...windowItem,
                              position: {
                                  x: clamp(nextX, -dragState.windowWidth + 60, maxX),
                                  y: clamp(nextY, 0, maxY)
                              }
                          }
                        : windowItem
                )
            );
        };

        const handleUp = () => setDragState(null);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };
    }, [dragState]);

    useEffect(() => {
        if (!resizeState) return;

        const handleMove = (event: MouseEvent) => {
            if (!workspaceRef.current) return;

            const dx = event.clientX - resizeState.startX;
            const dy = event.clientY - resizeState.startY;
            const { direction, startPosition, startSize } = resizeState;

            let nextX = startPosition.x;
            let nextY = startPosition.y;
            let nextWidth = startSize.width;
            let nextHeight = startSize.height;

            if (direction.includes("e")) {
                nextWidth = Math.max(MIN_WINDOW_WIDTH, startSize.width + dx);
            }

            if (direction.includes("s")) {
                nextHeight = Math.max(MIN_WINDOW_HEIGHT, startSize.height + dy);
            }

            if (direction.includes("w")) {
                nextWidth = Math.max(MIN_WINDOW_WIDTH, startSize.width - dx);
                nextX = startPosition.x + (startSize.width - nextWidth);
            }

            if (direction.includes("n")) {
                nextHeight = Math.max(MIN_WINDOW_HEIGHT, startSize.height - dy);
                nextY = startPosition.y + (startSize.height - nextHeight);
            }

            setWindows((currentWindows) =>
                currentWindows.map((windowItem) =>
                    windowItem.id === resizeState.id
                        ? {
                              ...windowItem,
                              position: { x: nextX, y: Math.max(0, nextY) },
                              size: { width: nextWidth, height: nextHeight }
                          }
                        : windowItem
                )
            );
        };

        const handleUp = () => setResizeState(null);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };
    }, [resizeState]);

    const focusWindow = (windowId: string) => {
        setWindows((currentWindows) => {
            const zIndex = nextZIndex(currentWindows);
            return currentWindows.map((windowItem) =>
                windowItem.id === windowId ? { ...windowItem, zIndex, minimized: false } : windowItem
            );
        });
        setFocusedWindowId(windowId);
    };

    const openFolderWindow = (folder: PortfolioFolderNode) => {
        const windowId = `folder:${folder.id}`;

        setWindows((currentWindows) => {
            const existingWindow = currentWindows.find((windowItem) => windowItem.id === windowId);
            const zIndex = nextZIndex(currentWindows);

            if (existingWindow) {
                return currentWindows.map((windowItem) =>
                    windowItem.id === windowId ? { ...windowItem, minimized: false, zIndex } : windowItem
                );
            }

            return [
                ...currentWindows,
                {
                    id: windowId,
                    label: folder.label,
                    kind: "folder",
                    folder,
                    position: createWindowPosition(currentWindows.length),
                    size: { ...folderWindowSize },
                    zIndex,
                    minimized: false
                }
            ];
        });

        setFocusedWindowId(windowId);
    };

    const openFileWindow = (file: PortfolioFileNode, folderId?: string) => {
        const windowId = folderId ? `file:${folderId}/${file.id}` : `file:${file.id}`;

        setWindows((currentWindows) => {
            const existingWindow = currentWindows.find((windowItem) => windowItem.id === windowId);
            const zIndex = nextZIndex(currentWindows);

            if (existingWindow) {
                return currentWindows.map((windowItem) =>
                    windowItem.id === windowId ? { ...windowItem, minimized: false, zIndex } : windowItem
                );
            }

            const windowSize = file.fileType === "design" && file.defaultSize
                ? { ...file.defaultSize }
                : { ...fileWindowSize };

            return [
                ...currentWindows,
                {
                    id: windowId,
                    label: file.label,
                    kind: "file",
                    file,
                    position: createWindowPosition(currentWindows.length),
                    size: windowSize,
                    zIndex,
                    minimized: false
                }
            ];
        });

        setFocusedWindowId(windowId);
    };

    const openImageWindow = (src: string, alt: string, title: string) => {
        const windowId = `image:${src}`;

        setWindows((currentWindows) => {
            const existingWindow = currentWindows.find((w) => w.id === windowId);
            const zIndex = nextZIndex(currentWindows);

            if (existingWindow) {
                return currentWindows.map((w) =>
                    w.id === windowId ? { ...w, minimized: false, zIndex } : w
                );
            }

            return [
                ...currentWindows,
                {
                    id: windowId,
                    label: title,
                    kind: "image" as const,
                    src,
                    alt,
                    title,
                    position: createWindowPosition(currentWindows.length),
                    size: { ...imageWindowSize },
                    zIndex,
                    minimized: false,
                },
            ];
        });

        setFocusedWindowId(windowId);
    };

    const openNode = (node: PortfolioDesktopNode) => {
        if (node.kind === "folder") {
            openFolderWindow(node);
            return;
        }

        openFileWindow(node);
    };

    const openTerminalWindow = () => {
        setWindows((currentWindows) => {
            const existing = currentWindows.find((w) => w.id === TERMINAL_WINDOW_ID);
            const zIndex = nextZIndex(currentWindows);
            if (existing) {
                return currentWindows.map((w) =>
                    w.id === TERMINAL_WINDOW_ID ? { ...w, minimized: false, zIndex } : w
                );
            }
            return [
                ...currentWindows,
                {
                    id: TERMINAL_WINDOW_ID,
                    label: "claude code",
                    kind: "terminal" as const,
                    position: createWindowPosition(currentWindows.length),
                    size: { ...terminalWindowSize },
                    zIndex,
                    minimized: false
                }
            ];
        });
        setFocusedWindowId(TERMINAL_WINDOW_ID);
    };

    const openNotepadWindow = () => {
        setWindows((currentWindows) => {
            const existing = currentWindows.find((w) => w.id === NOTEPAD_WINDOW_ID);
            const zIndex = nextZIndex(currentWindows);
            if (existing) {
                return currentWindows.map((w) =>
                    w.id === NOTEPAD_WINDOW_ID ? { ...w, minimized: false, zIndex } : w
                );
            }
            return [
                ...currentWindows,
                {
                    id: NOTEPAD_WINDOW_ID,
                    label: "readme.txt",
                    kind: "notepad" as const,
                    position: createWindowPosition(currentWindows.length + 1),
                    size: { ...notepadWindowSize },
                    zIndex,
                    minimized: false
                }
            ];
        });
        setFocusedWindowId(NOTEPAD_WINDOW_ID);
    };

    const openFolderById = (id: string) => {
        const folder = folderNodes.find((f) => f.id === id);
        if (folder) openFolderWindow(folder);
    };

    const clearIconSelections = () => {
        setSelectedDesktopNodeId(null);
        setSelectedFolderNodeIds({});
    };

    const closeWindow = (windowId: string) => {
        setWindows((currentWindows) => currentWindows.filter((windowItem) => windowItem.id !== windowId));
        setSelectedFolderNodeIds((currentSelections) => {
            if (!currentSelections[windowId]) return currentSelections;
            const nextSelections = { ...currentSelections };
            delete nextSelections[windowId];
            return nextSelections;
        });
    };

    const minimizeWindow = (windowId: string) => {
        setWindows((currentWindows) =>
            currentWindows.map((windowItem) => (windowItem.id === windowId ? { ...windowItem, minimized: true } : windowItem))
        );
    };

    const activeFocusedWindowId = useMemo(() => {
        const focusedWindow = focusedWindowId ? windows.find((windowItem) => windowItem.id === focusedWindowId) : null;
        if (focusedWindow && !focusedWindow.minimized) return focusedWindow.id;

        return [...windows]
            .filter((windowItem) => !windowItem.minimized)
            .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null;
    }, [focusedWindowId, windows]);

    const toggleFromTaskbar = (windowId: string) => {
        const targetWindow = windows.find((windowItem) => windowItem.id === windowId);
        if (!targetWindow) return;

        if (targetWindow.minimized) {
            focusWindow(windowId);
            return;
        }

        if (activeFocusedWindowId === windowId) {
            minimizeWindow(windowId);
            return;
        }

        focusWindow(windowId);
    };

    const startDrag = (event: ReactMouseEvent<HTMLDivElement>, windowId: string) => {
        if (event.button !== 0) return;

        const workspaceBounds = workspaceRef.current?.getBoundingClientRect();
        const targetWindow = windows.find((windowItem) => windowItem.id === windowId);
        if (!workspaceBounds || !targetWindow) return;

        setDragState({
            id: windowId,
            offsetX: event.clientX - workspaceBounds.left - targetWindow.position.x,
            offsetY: event.clientY - workspaceBounds.top - targetWindow.position.y,
            windowWidth: targetWindow.size.width,
            windowHeight: targetWindow.size.height
        });
        setResizeState(null);

        focusWindow(windowId);
        event.preventDefault();
    };

    const startResize = (event: ReactMouseEvent<HTMLDivElement>, windowId: string, direction: ResizeDirection) => {
        if (event.button !== 0) return;

        const targetWindow = windows.find((windowItem) => windowItem.id === windowId);
        if (!targetWindow) return;

        setResizeState({
            id: windowId,
            direction,
            startX: event.clientX,
            startY: event.clientY,
            startPosition: targetWindow.position,
            startSize: targetWindow.size
        });
        setDragState(null);

        focusWindow(windowId);
        event.preventDefault();
        event.stopPropagation();
    };

    const clockLabel = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const visibleWindows = [...windows].filter((windowItem) => !windowItem.minimized).sort((a, b) => a.zIndex - b.zIndex);

    const handleLauncherSingleClick = (id: string) => setSelectedDesktopNodeId(id);
    const renderLauncherIcon = (id: string, label: string, iconArtClass: string, onOpen: () => void) => {
        const selected = selectedDesktopNodeId === id;
        return (
            <button
                key={id}
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    handleLauncherSingleClick(id);
                }}
                onDoubleClick={(event) => {
                    event.stopPropagation();
                    onOpen();
                }}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOpen();
                    }
                }}
                className={cn(
                    "group text-center outline-none transition",
                    styles.iconSurface,
                    styles.desktopIconSurface,
                    selected && styles.desktopIconSurfaceSelected
                )}
            >
                <span aria-hidden="true" className={cn(styles.iconArt, styles.desktopIconArt, iconArtClass)} />
                <span
                    className={cn(
                        styles.iconLabel,
                        styles.desktopIconLabel,
                        selected && styles.desktopIconLabelSelected
                    )}
                >
                    {label}
                </span>
            </button>
        );
    };

    return (
        <section
            id="projects"
            className={cn("relative h-screen w-full overflow-hidden text-[#f4f4f4]", styles.retroDesktopTokens)}
            aria-label="abir_os retro desktop"
        >
            <div className="relative flex h-full w-full flex-col overflow-hidden">
                <div
                    ref={workspaceRef}
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            clearIconSelections();
                            setStartMenuOpen(false);
                        }
                    }}
                    className={styles.desktop}
                >
                    <div className={styles.wordmarkWallpaper} aria-hidden="true">
                        <div className={styles.wordmarkRow}>ABIR · ABIR · ABIR · ABIR</div>
                        <div className={cn(styles.wordmarkRow, styles.wordmarkRowAlt)}>RIBA · RIBA · RIBA · RIBA</div>
                        <div className={styles.wordmarkRow}>ABIR · ABIR · ABIR · ABIR</div>
                        <div className={cn(styles.wordmarkRow, styles.wordmarkRowAlt)}>RIBA · RIBA · RIBA · RIBA</div>
                    </div>
                    <div className={styles.desktopLabel}>abir_os · v3 — double-click to explore</div>
                    <div
                        className={styles.desktopIconsGrid}
                        onClick={(event) => {
                            if (event.target === event.currentTarget) {
                                clearIconSelections();
                            }
                        }}
                    >
                        {rootNodes.map((node) => {
                            const isDesktopIconSelected = selectedDesktopNodeId === node.id;

                            return (
                                <button
                                    key={node.id}
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setSelectedDesktopNodeId(node.id);
                                    }}
                                    onDoubleClick={(event) => {
                                        event.stopPropagation();
                                        openNode(node);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            openNode(node);
                                        }
                                    }}
                                    className={cn(
                                        "group text-center outline-none transition",
                                        styles.iconSurface,
                                        styles.desktopIconSurface,
                                        isDesktopIconSelected && styles.desktopIconSurfaceSelected
                                    )}
                                >
                                    <RetroNodeIcon node={node} size="desktop" />
                                    <span
                                        className={cn(
                                            styles.iconLabel,
                                            styles.desktopIconLabel,
                                            isDesktopIconSelected && styles.desktopIconLabelSelected
                                        )}
                                    >
                                        {node.label}
                                    </span>
                                </button>
                            );
                        })}
                        {renderLauncherIcon("__terminal__", "Claude Code", styles.iconTerminal, openTerminalWindow)}
                        {renderLauncherIcon("__readme__", "readme.txt", cn(styles.iconFile, styles.iconFilePaper), openNotepadWindow)}
                    </div>

                        {visibleWindows.map((windowItem) => {
                            const isFocused = activeFocusedWindowId === windowItem.id;
                            const stdFile: PortfolioStandardFileNode | null = windowItem.kind === "file" && windowItem.file.fileType !== "design" ? windowItem.file as PortfolioStandardFileNode : null;
                            const linkHref = stdFile ? toLinkHref(stdFile.data.link) : null;
                            const previewImage = stdFile?.data.previewImage;
                            const previewImageSrc = previewImage ? toMediaSrc(previewImage.src) : null;
                            const [statusLeft, statusRight] = getWindowStatus(windowItem);
                            const titleLabel = getWindowTitle(windowItem);

                            return (
                                <div
                                    key={windowItem.id}
                                    data-window-id={windowItem.id}
                                    style={{
                                        left: windowItem.position.x,
                                        top: windowItem.position.y,
                                        width: windowItem.size.width,
                                        height: windowItem.size.height,
                                        zIndex: windowItem.zIndex
                                    }}
                                    onMouseDown={() => focusWindow(windowItem.id)}
                                    className={cn(
                                        styles.windowFrame,
                                        isFocused && styles.windowFrameFocused,
                                        windowItem.kind === "terminal" && styles.windowTerm,
                                        windowItem.kind === "notepad" && styles.windowNote
                                    )}
                                >
                                    <div
                                        onMouseDown={(event) => startDrag(event, windowItem.id)}
                                        className={cn(styles.windowTitleBar, isFocused && styles.windowTitleBarFocused)}
                                    >
                                        <span className={styles.windowTitleText}>{titleLabel}</span>
                                        <div className={styles.windowTitleButtons}>
                                            <button
                                                type="button"
                                                onMouseDown={(event) => event.stopPropagation()}
                                                onClick={() => minimizeWindow(windowItem.id)}
                                                className={styles.windowTitleButton}
                                                aria-label={`Minimize ${windowItem.label}`}
                                            >
                                                _
                                            </button>
                                            <button
                                                type="button"
                                                onMouseDown={(event) => event.stopPropagation()}
                                                onClick={() => closeWindow(windowItem.id)}
                                                className={styles.windowTitleButton}
                                                aria-label={`Close ${windowItem.label}`}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.windowMenuBar}>
                                        <span><u>F</u>ile</span>
                                        <span><u>E</u>dit</span>
                                        <span><u>V</u>iew</span>
                                        <span><u>H</u>elp</span>
                                    </div>

                                    <div
                                        className={cn(
                                            styles.windowBody,
                                            windowItem.kind === "image" && styles.windowBodyImage,
                                            windowItem.kind === "terminal" && styles.windowTermBody,
                                            windowItem.kind === "notepad" && styles.windowNoteBody,
                                            windowItem.kind === "file" && windowItem.file.fileType === "design" && styles.windowBodyDesign
                                        )}
                                    >
                                        {windowItem.kind === "folder" ? (
                                            <div className={styles.folderFilesGrid}>
                                                {windowItem.folder.children.map((childNode) => {
                                                    const isFolderIconSelected = selectedFolderNodeIds[windowItem.id] === childNode.id;

                                                    return (
                                                        <button
                                                            key={childNode.id}
                                                            type="button"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                setSelectedFolderNodeIds((currentSelections) => ({
                                                                    ...currentSelections,
                                                                    [windowItem.id]: childNode.id
                                                                }));
                                                            }}
                                                            onDoubleClick={(event) => {
                                                                event.stopPropagation();
                                                                openFileWindow(childNode, windowItem.folder.id);
                                                            }}
                                                            onKeyDown={(event) => {
                                                                if (event.key === "Enter" || event.key === " ") {
                                                                    event.preventDefault();
                                                                    openFileWindow(childNode, windowItem.folder.id);
                                                                }
                                                            }}
                                                            className={cn(
                                                                "justify-center text-center outline-none transition",
                                                                styles.iconSurface,
                                                                styles.folderIconSurface,
                                                                isFolderIconSelected && styles.folderIconSurfaceSelected
                                                            )}
                                                        >
                                                            <RetroNodeIcon node={childNode} size="folder" />
                                                            <span
                                                                className={cn(
                                                                    styles.iconLabel,
                                                                    styles.folderIconLabel,
                                                                    isFolderIconSelected && styles.folderIconLabelSelected
                                                                )}
                                                            >
                                                                {childNode.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : null}

                                        {windowItem.kind === "file" ? (
                                            <article className={styles.fileDetail}>
                                                {windowItem.file.fileType === "design" ? (
                                                    <div className={styles.fileDetailDesign}>
                                                        <windowItem.file.component roleCard={windowItem.file.roleCard} designLanguageCard={windowItem.file.designLanguageCard} />
                                                    </div>
                                                ) : windowItem.file.fileType === "game" ? (
                                                    <div className="col-span-2">
                                                        <GameContainer gameId={windowItem.file.id} />
                                                        <div className="mt-4 border-t border-[#7a7668] pt-4">
                                                            <h3 className={styles.fileDetailTitle}>{stdFile!.data.title}</h3>
                                                            <p className="font-mono text-[10px] text-[#5a5a5a] mb-2">{stdFile!.data.blurb}</p>
                                                            <div className={styles.fileDetailTags}>
                                                                {stdFile!.data.tags.map((item) => (
                                                                    <span key={item} className={styles.fileDetailTag}>
                                                                        {item}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (() => {
                                                    const githubInfo = stdFile && stdFile.data.link && stdFile.data.link.startsWith("https://github.com/")
                                                        ? getGithubRepoInfo(stdFile.data.link)
                                                        : null;
                                                    return (
                                                        <>
                                                            <div className={styles.fileDetailPreviewWrapper}>
                                                                <div className={styles.fileDetailPreview}>
                                                                    {previewImageSrc ? (
                                                                        <button
                                                                            type="button"
                                                                            className={styles.fileDetailPreviewButton}
                                                                            onClick={() => openImageWindow(
                                                                                previewImageSrc,
                                                                                previewImage?.alt ?? stdFile!.data.title,
                                                                                stdFile!.data.title
                                                                            )}
                                                                        >
                                                                            <img
                                                                                src={previewImageSrc}
                                                                                alt={previewImage?.alt ?? `${stdFile!.data.title} preview`}
                                                                                className={styles.fileDetailPreviewImage}
                                                                            />
                                                                        </button>
                                                                    ) : githubInfo ? (
                                                                        <div style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #1a1a1a" }}>
                                                                            {/* Title bar */}
                                                                            <div style={{
                                                                                height: "20px",
                                                                                background: "linear-gradient(180deg, #d97a2a 0%, #a84e0e 100%)",
                                                                                color: "#fff",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                padding: "0 6px",
                                                                                fontFamily: "var(--retro-icon-mono)",
                                                                                fontSize: "9px",
                                                                                fontWeight: "bold",
                                                                                letterSpacing: "0.04em",
                                                                                textTransform: "uppercase",
                                                                                borderBottom: "1.5px solid #1a1a1a",
                                                                                userSelect: "none"
                                                                            }}>
                                                                                <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" style={{ marginRight: "4px", flexShrink: 0 }}>
                                                                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                                                                                </svg>
                                                                                <span>github.exe</span>
                                                                                <div style={{ marginLeft: "auto", display: "flex", gap: "2px" }}>
                                                                                    <span style={{
                                                                                        width: "10px",
                                                                                        height: "10px",
                                                                                        border: "1px solid #1a1a1a",
                                                                                        background: "#c8c4b8",
                                                                                        display: "grid",
                                                                                        placeItems: "center",
                                                                                        fontSize: "7px",
                                                                                        lineHeight: 1,
                                                                                        boxShadow: "inset 1px 1px 0 #ebe7db, inset -1px -1px 0 #7a7668"
                                                                                    }}>_</span>
                                                                                    <span style={{
                                                                                        width: "10px",
                                                                                        height: "10px",
                                                                                        border: "1px solid #1a1a1a",
                                                                                        background: "#c8c4b8",
                                                                                        display: "grid",
                                                                                        placeItems: "center",
                                                                                        fontSize: "7px",
                                                                                        lineHeight: 1,
                                                                                        boxShadow: "inset 1px 1px 0 #ebe7db, inset -1px -1px 0 #7a7668"
                                                                                    }}>✕</span>
                                                                                </div>
                                                                            </div>
                                                                            {/* Body */}
                                                                            <div style={{
                                                                                padding: "10px 8px",
                                                                                background: "#fff",
                                                                                color: "#1a1a1a",
                                                                                textAlign: "left",
                                                                                fontFamily: "var(--retro-icon-mono)",
                                                                                fontSize: "11px",
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                gap: "4px"
                                                                            }}>
                                                                                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#5a5a5a", fontSize: "9px" }}>
                                                                                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                                                                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                                                                    </svg>
                                                                                    <span>{githubInfo.owner}</span>
                                                                                </div>
                                                                                <div style={{
                                                                                    fontWeight: "bold",
                                                                                    fontSize: "12px",
                                                                                    color: "#0055aa",
                                                                                    textDecoration: "underline",
                                                                                    wordBreak: "break-all",
                                                                                    lineHeight: "1.2"
                                                                                }}>
                                                                                    {githubInfo.repo}
                                                                                </div>
                                                                                <div style={{ color: "#5a5a5a", fontSize: "9px", lineHeight: "1.3", margin: "2px 0" }}>
                                                                                    GitHub Repository
                                                                                </div>
                                                                                <div style={{ display: "flex", gap: "8px", fontSize: "8px", color: "#6a6a6a", marginTop: "2px", fontWeight: "bold" }}>
                                                                                    <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                                                                        <span style={{ color: "#d97a2a" }}>★</span> Stars
                                                                                    </span>
                                                                                    <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                                                                        <span>⑂</span> Forks
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            {/* Action button */}
                                                                            <a
                                                                                href={stdFile!.data.link}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                style={{
                                                                                    display: "block",
                                                                                    textAlign: "center",
                                                                                    padding: "6px",
                                                                                    background: "#efece0",
                                                                                    color: "#1a1a1a",
                                                                                    fontWeight: "bold",
                                                                                    fontSize: "8.5px",
                                                                                    textTransform: "uppercase",
                                                                                    fontFamily: "var(--retro-icon-mono)",
                                                                                    borderTop: "1.5px solid #1a1a1a",
                                                                                    textDecoration: "none",
                                                                                    cursor: "pointer",
                                                                                    boxShadow: "inset 1px 1px 0 #fff"
                                                                                }}
                                                                            >
                                                                                VISIT REPO ↗
                                                                            </a>
                                                                        </div>
                                                                    ) : (
                                                                        <div className={styles.fileDetailPreviewPlaceholder}>[ no preview ]</div>
                                                                    )}
                                                                </div>
                                                                {previewImageSrc ? (
                                                                    <span className={styles.fileDetailPreviewHint}>click to expand ↗</span>
                                                                ) : null}
                                                            </div>
                                                            <div className={styles.fileDetailContent}>
                                                                <h3 className={styles.fileDetailTitle}>{stdFile!.data.title}</h3>

                                                                <dl className={styles.fileDetailMeta}>
                                                                    <dt className={styles.fileDetailMetaKey}>role</dt>
                                                                    <dd>{stdFile!.data.role}</dd>
                                                                    <dt className={styles.fileDetailMetaKey}>year</dt>
                                                                    <dd>{stdFile!.data.year}</dd>
                                                                    <dt className={styles.fileDetailMetaKey}>stack</dt>
                                                                    <dd>{stdFile!.data.stack.join(", ")}</dd>
                                                                </dl>

                                                                <div className={styles.fileDetailDescription}>
                                                                    <p>{stdFile!.data.blurb}</p>
                                                                    {stdFile!.data.notes ? <p className={styles.fileDetailNotes}>{stdFile!.data.notes}</p> : null}
                                                                </div>

                                                                {stdFile!.data.tags.length > 0 ? (
                                                                    <div className={styles.fileDetailTags}>
                                                                        {stdFile!.data.tags.map((item) => (
                                                                            <span key={item} className={styles.fileDetailTag}>
                                                                                {item}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                ) : null}

                                                                {linkHref ? (
                                                                    <a href={linkHref} target="_blank" rel="noreferrer" className={styles.fileDetailLink}>
                                                                        {stdFile!.data.link}
                                                                    </a>
                                                                ) : null}
                                                            </div>

                                                            {stdFile!.data.mediaAssets.length > 0 ? (
                                                                <div className={styles.fileDetailMediaSection}>
                                                                    <h4 className={styles.fileDetailMediaHeading}>media assets</h4>
                                                                    <div className={styles.fileDetailMediaList}>{stdFile!.data.mediaAssets.map(renderMediaAsset)}</div>
                                                                </div>
                                                            ) : null}
                                                    </>
                                                    );
                                                })()}
                                            </article>
                                        ) : null}

                                        {windowItem.kind === "image" ? (
                                            <div className={styles.imageWindowBody}>
                                                <img
                                                    src={windowItem.src}
                                                    alt={windowItem.alt}
                                                    className={styles.imageWindowImg}
                                                />
                                            </div>
                                        ) : null}

                                        {windowItem.kind === "terminal" ? <TerminalWindow /> : null}

                                        {windowItem.kind === "notepad" ? <ReadmeNotepad /> : null}
                                    </div>

                                    <div className={styles.windowStatusBar}>
                                        <span>{statusLeft}</span>
                                        <span>{statusRight}</span>
                                    </div>

                                    {resizeHandles.map((direction) => (
                                        <div
                                            key={direction}
                                            role="presentation"
                                            onMouseDown={(event) => startResize(event, windowItem.id, direction)}
                                            className={cn(styles.resizeHandle, resizeHandleClasses[direction])}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    <footer className={styles.taskbar}>
                        <div className={styles.startMenuAnchor}>
                            <button
                                type="button"
                                className={styles.taskbarStart}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setStartMenuOpen((open) => !open);
                                }}
                            >
                                Start
                            </button>
                            <StartMenu
                                open={startMenuOpen}
                                folders={folderNodes.map((folder) => ({ id: folder.id, label: folder.label }))}
                                onOpenTerminal={() => {
                                    openTerminalWindow();
                                    setStartMenuOpen(false);
                                }}
                                onOpenReadme={() => {
                                    openNotepadWindow();
                                    setStartMenuOpen(false);
                                }}
                                onOpenFolder={(id) => {
                                    openFolderById(id);
                                    setStartMenuOpen(false);
                                }}
                            />
                        </div>
                        <span className={styles.taskbarSeparator} aria-hidden="true" />

                        <div className={styles.taskbarItems}>
                            {windows.map((windowItem) => {
                                const isFocused = activeFocusedWindowId === windowItem.id && !windowItem.minimized;
                                return (
                                    <button
                                        key={windowItem.id}
                                        type="button"
                                        onClick={() => toggleFromTaskbar(windowItem.id)}
                                        className={cn(styles.taskbarItem, isFocused && styles.taskbarItemFocused)}
                                    >
                                        <span className={styles.taskbarMini} aria-hidden="true" />
                                        <span className={styles.taskbarItemLabel}>{getWindowTitle(windowItem)}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <span className={styles.taskbarClock}>{clockLabel}</span>
                    </footer>
                </div>
        </section>
    );
};

export default DesktopSection;
