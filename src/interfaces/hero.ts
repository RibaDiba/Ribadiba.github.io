export interface HeroSectionProps {
    className?: string;
    topbarText?: string;
    modeText?: string;
    noteText?: string;
    rows?: readonly HeroWordmarkRow[];
    repeatCount?: number;
}

export interface HeroWordmarkRow {
    word: string;
    tone?: "primary" | "muted";
}
