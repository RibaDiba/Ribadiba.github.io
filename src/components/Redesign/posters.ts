import { getAssetPath } from "@/utils/paths";

export interface PosterCardData {
    src: string;
    alt: string;
    caption: string;
}

export const posterCaptionsByOrder: string[] = [
    "PlayStation · 1996",
    "Who are you? · 2002",
    "Sony DR-11 · 1973",
    "Just Start · 2006",
];

export const defaultPosters: PosterCardData[] = [
    {
        src: getAssetPath("/Personal Website/assets/poster-juststart.png"),
        alt: "Just Start poster",
        caption: "Just Start · 2006"
    },
    {
        src: getAssetPath("/Personal Website/assets/poster-sony.png"),
        alt: "Sony DR-11 poster",
        caption: "Sony DR-11 · 1973"
    },
    {
        src: getAssetPath("/Personal Website/assets/poster-whoareyou.png"),
        alt: "Who Are You poster",
        caption: "Who are you? · 2002"
    },
    {
        src: getAssetPath("/Personal Website/assets/poster-god.png"),
        alt: "Playstation Edge poster",
        caption: "PlayStation · 1996"
    }
];
