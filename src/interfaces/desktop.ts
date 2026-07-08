import type { PortfolioDesktopNode, PortfolioFileNode, PortfolioFileType, PortfolioFolderNode } from "@/interfaces/portfolio";

export interface BaseWindow {
    id: string;
    label: string;
    position: WindowPosition;
    size: WindowSize;
    zIndex: number;
    minimized: boolean;
}

export interface DragState {
    id: string;
    offsetX: number;
    offsetY: number;
    windowWidth: number;
    windowHeight: number;
}

export interface FileWindow extends BaseWindow {
    kind: "file";
    file: PortfolioFileNode;
}

export interface FolderWindow extends BaseWindow {
    kind: "folder";
    folder: PortfolioFolderNode;
}

export interface ImageWindow extends BaseWindow {
    kind: "image";
    src: string;
    alt: string;
    title: string;
}

export interface NotepadLauncherWindow extends BaseWindow {
    kind: "notepad";
}

export type OpenWindow = FolderWindow | FileWindow | ImageWindow | TerminalLauncherWindow | NotepadLauncherWindow;

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export interface ResizeState {
    id: string;
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startPosition: WindowPosition;
    startSize: WindowSize;
}

export type RetroIconVariant = "folder" | PortfolioFileType;

export interface RetroNodeIconProps {
    node: PortfolioDesktopNode | PortfolioFileNode;
    size: "desktop" | "folder";
}

export interface TerminalLauncherWindow extends BaseWindow {
    kind: "terminal";
}

export interface WindowPosition {
    x: number;
    y: number;
}

export interface WindowSize {
    width: number;
    height: number;
}
