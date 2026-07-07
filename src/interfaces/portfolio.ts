import type React from "react";

export const portfolioFileTypes = ["img", "code", "paper", "game", "design"] as const;
export const portfolioMediaTypes = ["image", "video", "document"] as const;

export type PortfolioDesktopNode = PortfolioFolderNode | PortfolioFileNode;

export interface DesignRoleCard {
    role: string;
    year: string;
    stack: string;
    tags: string[];
    linkText: string;
    linkHref?: string;
}

export interface DesignLanguageCard {
    swatches: string[];
    description: string;
}

export interface DesignCardProps {
    roleCard: DesignRoleCard;
    designLanguageCard: DesignLanguageCard;
}

export interface PortfolioDesignFileNode {
    id: string;
    label: string;
    kind: "file";
    fileType: "design";
    iconSrc?: string;
    component: React.ComponentType<DesignCardProps>;
    /** Override default window size to match the DesignStage aspect ratio */
    defaultSize?: { width: number; height: number };
    roleCard: DesignRoleCard;
    designLanguageCard: DesignLanguageCard;
}

export interface PortfolioFileData {
    title: string;
    role: string;
    year: string;
    stack: string[];
    blurb: string;
    notes: string;
    tags: string[];
    link: string;
    previewImage?: PortfolioPreviewImage;
    mediaAssets: PortfolioMediaAsset[];
}

export type PortfolioFileNode = PortfolioStandardFileNode | PortfolioDesignFileNode;

export type PortfolioFileType = (typeof portfolioFileTypes)[number];

export interface PortfolioFolderNode {
    id: string;
    label: string;
    kind: "folder";
    children: PortfolioFileNode[];
}

export interface PortfolioMediaAsset {
    type: PortfolioMediaType;
    source: PortfolioMediaSource;
    src: string;
    alt?: string;
}

export type PortfolioMediaSource = "local" | "external";

export type PortfolioMediaType = (typeof portfolioMediaTypes)[number];

export interface PortfolioPreviewImage {
    source: PortfolioMediaSource;
    src: string;
    alt?: string;
}

export interface PortfolioStandardFileNode {
    id: string;
    label: string;
    kind: "file";
    fileType: Exclude<PortfolioFileType, "design">;
    data: PortfolioFileData;
}
