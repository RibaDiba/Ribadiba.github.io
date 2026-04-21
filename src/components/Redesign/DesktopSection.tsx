"use client";

import { type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
    retroDesktopPortfolioNodes,
    type PortfolioDesktopNode,
    type PortfolioFileNode,
    type PortfolioFileType,
    type PortfolioFolderNode,
    type PortfolioMediaAsset
} from "@/stores/RetroDesktopPortfolio";
import { getAssetPath } from "@/utils/paths";
import styles from "./DesktopSection.module.css";

interface WindowPosition {
    x: number;
    y: number;
}

interface WindowSize {
    width: number;
    height: number;
}

interface BaseWindow {
    id: string;
    label: string;
    position: WindowPosition;
    size: WindowSize;
    zIndex: number;
    minimized: boolean;
}

interface FolderWindow extends BaseWindow {
    kind: "folder";
    folder: PortfolioFolderNode;
}

interface FileWindow extends BaseWindow {
    kind: "file";
    file: PortfolioFileNode;
}

interface ImageWindow extends BaseWindow {
    kind: "image";
    src: string;
    alt: string;
    title: string;
}

type OpenWindow = FolderWindow | FileWindow | ImageWindow;

interface DragState {
    id: string;
    offsetX: number;
    offsetY: number;
    windowWidth: number;
    windowHeight: number;
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

interface ResizeState {
    id: string;
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startPosition: WindowPosition;
    startSize: WindowSize;
}

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type RetroIconVariant = "folder" | PortfolioFileType;

const retroFileVariantClasses: Record<PortfolioFileType, string> = {
    img: styles.iconFileImg,
    code: styles.iconFileCode,
    paper: styles.iconFilePaper,
    game: styles.iconFileCode
};

const getNodeIconVariant = (node: PortfolioDesktopNode | PortfolioFileNode): RetroIconVariant => {
    if (node.kind === "folder") return "folder";
    return node.fileType;
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
        if (!imageSrc) return null;

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
    return `${windowItem.label} — properties`;
};

const getWindowStatus = (windowItem: OpenWindow) => {
    if (windowItem.kind === "folder") return [`${windowItem.folder.children.length} item(s)`, `/abir/${windowItem.folder.label}`];
    if (windowItem.kind === "image") return ["image", windowItem.label];
    return ["ready", windowItem.label];
};

interface RetroNodeIconProps {
    node: PortfolioDesktopNode | PortfolioFileNode;
    size: "desktop" | "folder";
}

const RetroNodeIcon = ({ node, size }: RetroNodeIconProps) => {
    const variant = getNodeIconVariant(node);
    const iconTypeClass = variant === "folder" ? styles.iconFolder : cn(styles.iconFile, retroFileVariantClasses[variant]);

    return (
        <span
            aria-hidden="true"
            className={cn(styles.iconArt, size === "desktop" ? styles.desktopIconArt : styles.folderIconArt, iconTypeClass)}
        />
    );
};

const DesktopSection = () => {
    const rootNodes = useMemo(() => retroDesktopPortfolioNodes, []);
    const workspaceRef = useRef<HTMLDivElement>(null);
    const hasAutoOpenedReadmeRef = useRef(false);

    const [windows, setWindows] = useState<OpenWindow[]>([]);
    const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [resizeState, setResizeState] = useState<ResizeState | null>(null);
    const [clock, setClock] = useState(() => new Date());
    const [selectedDesktopNodeId, setSelectedDesktopNodeId] = useState<string | null>(null);
    const [selectedFolderNodeIds, setSelectedFolderNodeIds] = useState<Record<string, string>>({});

    useEffect(() => {
        const intervalId = window.setInterval(() => setClock(new Date()), 1000);
        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (hasAutoOpenedReadmeRef.current) return;

        const readmeNode = rootNodes.find((node): node is PortfolioFileNode => node.kind === "file" && node.id === "about");
        if (!readmeNode) return;

        hasAutoOpenedReadmeRef.current = true;
        const timerId = window.setTimeout(() => {
            setWindows((currentWindows) => {
                const windowId = `file:${readmeNode.id}`;
                if (currentWindows.some((windowItem) => windowItem.id === windowId)) return currentWindows;

                const zIndex = nextZIndex(currentWindows);
                return [
                    ...currentWindows,
                    {
                        id: windowId,
                        label: readmeNode.label,
                        kind: "file",
                        file: readmeNode,
                        position: (() => {
                            const bounds = workspaceRef.current?.getBoundingClientRect();
                            if (!bounds) return createWindowPosition(currentWindows.length);
                            return {
                                x: Math.max(0, (bounds.width - fileWindowSize.width) / 2),
                                y: Math.max(0, (bounds.height - fileWindowSize.height) / 2),
                            };
                        })(),
                        size: { ...fileWindowSize },
                        zIndex,
                        minimized: false
                    }
                ];
            });
            setFocusedWindowId(`file:${readmeNode.id}`);
        }, 150);

        return () => window.clearTimeout(timerId);
    }, [rootNodes]);

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

            return [
                ...currentWindows,
                {
                    id: windowId,
                    label: file.label,
                    kind: "file",
                    file,
                    position: createWindowPosition(currentWindows.length),
                    size: { ...fileWindowSize },
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

    return (
        <section id="projects" className={cn("min-h-screen w-full bg-[#0f0f10] text-[#f4f4f4]", styles.retroDesktopTokens)} aria-label="retro desktop portfolio">
            <div className="w-full">
                <div className="relative m-2 flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(180deg,#101113_0%,#15161a_40%,#131419_100%)] sm:m-3">
                    <div
                        ref={workspaceRef}
                        onClick={(event) => {
                            if (event.target === event.currentTarget) {
                                clearIconSelections();
                            }
                        }}
                        className={styles.desktop}
                    >
                        <div className={styles.desktopLabel}>abir_os · v1.0 — double-click to explore</div>
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
                        </div>

                        {visibleWindows.map((windowItem) => {
                            const isFocused = activeFocusedWindowId === windowItem.id;
                            const linkHref = windowItem.kind === "file" ? toLinkHref(windowItem.file.data.link) : null;
                            const previewImage = windowItem.kind === "file" ? windowItem.file.data.previewImage : undefined;
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
                                    className={cn(styles.windowFrame, isFocused && styles.windowFrameFocused)}
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

                                    <div className={cn(styles.windowBody, windowItem.kind === "image" && styles.windowBodyImage)}>
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
                                                {windowItem.file.fileType === "game" ? (
                                                    <div className="col-span-2">
                                                        <GameContainer gameId={windowItem.file.id} />
                                                        <div className="mt-4 border-t border-[#7a7668] pt-4">
                                                            <h3 className={styles.fileDetailTitle}>{windowItem.file.data.title}</h3>
                                                            <p className="font-mono text-[10px] text-[#5a5a5a] mb-2">{windowItem.file.data.blurb}</p>
                                                            <div className={styles.fileDetailTags}>
                                                                {windowItem.file.data.tags.map((item) => (
                                                                    <span key={item} className={styles.fileDetailTag}>
                                                                        {item}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className={styles.fileDetailPreviewWrapper}>
                                                            <div className={styles.fileDetailPreview}>
                                                                {previewImageSrc ? (
                                                                    <button
                                                                        type="button"
                                                                        className={styles.fileDetailPreviewButton}
                                                                        onClick={() => openImageWindow(
                                                                            previewImageSrc,
                                                                            previewImage?.alt ?? windowItem.file.data.title,
                                                                            windowItem.file.data.title
                                                                        )}
                                                                    >
                                                                        <img
                                                                            src={previewImageSrc}
                                                                            alt={previewImage?.alt ?? `${windowItem.file.data.title} preview`}
                                                                            className={styles.fileDetailPreviewImage}
                                                                        />
                                                                    </button>
                                                                ) : (
                                                                    <>[ project · {windowItem.file.data.title} ]</>
                                                                )}
                                                            </div>
                                                            {previewImageSrc ? (
                                                                <span className={styles.fileDetailPreviewHint}>click to expand ↗</span>
                                                            ) : null}
                                                        </div>
                                                        <div className={styles.fileDetailContent}>
                                                            <h3 className={styles.fileDetailTitle}>{windowItem.file.data.title}</h3>

                                                            <dl className={styles.fileDetailMeta}>
                                                                <dt className={styles.fileDetailMetaKey}>role</dt>
                                                                <dd>{windowItem.file.data.role}</dd>
                                                                <dt className={styles.fileDetailMetaKey}>year</dt>
                                                                <dd>{windowItem.file.data.year}</dd>
                                                                <dt className={styles.fileDetailMetaKey}>stack</dt>
                                                                <dd>{windowItem.file.data.stack.join(", ")}</dd>
                                                            </dl>

                                                            <div className={styles.fileDetailDescription}>
                                                                <p>{windowItem.file.data.blurb}</p>
                                                                {windowItem.file.data.notes ? <p className={styles.fileDetailNotes}>{windowItem.file.data.notes}</p> : null}
                                                            </div>

                                                            {windowItem.file.data.tags.length > 0 ? (
                                                                <div className={styles.fileDetailTags}>
                                                                    {windowItem.file.data.tags.map((item) => (
                                                                        <span key={item} className={styles.fileDetailTag}>
                                                                            {item}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : null}

                                                            {linkHref ? (
                                                                <a href={linkHref} target="_blank" rel="noreferrer" className={styles.fileDetailLink}>
                                                                    {windowItem.file.data.link}
                                                                </a>
                                                            ) : (
                                                                <p className={styles.fileDetailLinkFallback}>{windowItem.file.data.link || "—"}</p>
                                                            )}

                                                            {windowItem.file.data.mediaAssets.length > 0 ? (
                                                                <div className={styles.fileDetailMediaSection}>
                                                                    <h4 className={styles.fileDetailMediaHeading}>media assets</h4>
                                                                    <div className={styles.fileDetailMediaList}>{windowItem.file.data.mediaAssets.map(renderMediaAsset)}</div>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </>
                                                )}
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
                        <button type="button" className={styles.taskbarStart}>Start</button>
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
            </div>
        </section>
    );
};

export default DesktopSection;
