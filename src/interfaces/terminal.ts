export interface StreamOptions {
    cancelled: () => boolean;
    cps: number;
    scrollEl: HTMLElement;
}
