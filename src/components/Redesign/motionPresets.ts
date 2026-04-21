import { type Transition, type Variants } from "framer-motion";

type Axis = "x" | "y";

interface SlideFadeOptions {
    axis?: Axis;
    offset?: number;
    duration?: number;
    delay?: number;
}

interface PopOptions {
    duration?: number;
    delay?: number;
}

const smoothEase: Transition["ease"] = [0.22, 1, 0.36, 1];

export const inViewOnce = { once: true, amount: 0.25 } as const;

export const createStaggerParent = (
    prefersReducedMotion: boolean,
    staggerChildren = 0.08,
    delayChildren = 0
): Variants => ({
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
        opacity: 1,
        transition: prefersReducedMotion ? { duration: 0.15 } : { staggerChildren, delayChildren }
    }
});

export const createSlideFadeVariants = (
    prefersReducedMotion: boolean,
    { axis = "y", offset = 18, duration = 0.55, delay = 0 }: SlideFadeOptions = {}
): Variants => {
    const hiddenAxis = axis === "x" ? { x: offset } : { y: offset };
    const visibleAxis = axis === "x" ? { x: 0 } : { y: 0 };

    return {
        hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, ...hiddenAxis },
        visible: {
            opacity: 1,
            ...visibleAxis,
            transition: {
                duration: prefersReducedMotion ? Math.min(duration, 0.22) : duration,
                delay,
                ease: smoothEase
            }
        }
    };
};

export const createPopVariants = (
    prefersReducedMotion: boolean,
    { duration = 0.42, delay = 0 }: PopOptions = {}
): Variants => ({
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: prefersReducedMotion ? Math.min(duration, 0.22) : duration,
            delay,
            ease: smoothEase
        }
    }
});

export const createAlternatingRowRevealVariants = (prefersReducedMotion: boolean): Variants => ({
    hidden: (index: number = 0) =>
        prefersReducedMotion
            ? { opacity: 0 }
            : {
                  opacity: 0,
                  x: index % 2 === 0 ? -28 : 28,
                  filter: "blur(2px)"
              },
    visible: (index: number = 0) => ({
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: prefersReducedMotion
            ? { duration: 0.2, delay: index * 0.03 }
            : { duration: 0.72, delay: 0.22 + index * 0.07, ease: smoothEase }
    })
});

export const createPosterCardRevealVariants = (prefersReducedMotion: boolean): Variants => ({
    hidden: (index: number = 0) =>
        prefersReducedMotion
            ? { opacity: 0 }
            : {
                  opacity: 0,
                  y: 24,
                  rotate: index % 2 === 0 ? -1.5 : 1.5,
                  scale: 0.97
              },
    visible: (index: number = 0) => ({
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: prefersReducedMotion
            ? { duration: 0.2, delay: index * 0.02 }
            : { duration: 0.48, delay: index * 0.06, ease: smoothEase }
    })
});

export const createCharacterRevealVariants = (
    prefersReducedMotion: boolean,
    startDelay = 0.42,
    stepDelay = 0.011
): Variants => ({
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)" },
    visible: (index: number = 0) => {
        const cadencePause = Math.floor(index / 26) * 0.025;
        const delay = startDelay + index * stepDelay + cadencePause;

        return {
            opacity: 1,
            filter: "blur(0px)",
            transition: prefersReducedMotion
                ? { duration: 0.14, delay: startDelay }
                : { duration: 0.08, delay, ease: "linear" }
        };
    }
});
