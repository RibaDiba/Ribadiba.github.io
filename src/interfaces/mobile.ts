import type { PortfolioFileNode } from "@/interfaces/portfolio";

export interface ProjectSheetProps {
    file: PortfolioFileNode;
    onClose: () => void;
}
