import {
    retroDesktopPortfolioNodes,
    type PortfolioFileNode,
    type PortfolioFolderNode,
    type PortfolioMediaAsset
} from "@/stores/RetroDesktopPortfolio";

export interface PosterCardData {
    src: string;
    alt: string;
    caption: string;
}

// Edit this array to control captions by poster order (index-based mapping).
export const posterCaptionsByOrder: string[] = [
    "PlayStation · 1996",
    "Who are you? · 2002",
    "Sony DR-11 · 1973",
    "Just Start · 2006",
];

export const defaultPosters: PosterCardData[] = (() => {
    const playFolder = retroDesktopPortfolioNodes.find(
        (node): node is PortfolioFolderNode => node.kind === "folder" && node.id === "play"
    );
    const postersFile = playFolder?.children.find(
        (node): node is PortfolioFileNode => node.kind === "file" && node.id === "posters"
    );

    return (postersFile?.data.mediaAssets ?? [])
        .filter((asset): asset is PortfolioMediaAsset & { type: "image" } => asset.type === "image")
        .map((asset, index) => {
            const alt = asset.alt ?? `poster ${index + 1}`;
            return {
                src: asset.src,
                alt,
                caption: posterCaptionsByOrder[index] ?? alt.toLowerCase()
            };
        });
})();
