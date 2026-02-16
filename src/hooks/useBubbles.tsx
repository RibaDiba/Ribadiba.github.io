"use client";

import { useEffect, useState } from "react";

export const useBubbles = () => {
    const [scrollY, setScrollY] = useState(0);
    const [bubbles, setBubbles] = useState<Array<{ id: number; top: number; left: number; size: number; speed: number }>>([]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const generateBubbles = () => {
            const newBubbles: Array<{ id: number; top: number; left: number; size: number; speed: number }> = [];

            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            // Mobile detection and responsive bubble sizing
            const isMobile = winWidth < 768;
            const count = isMobile ? 4 : 7;
            const minSize = isMobile ? 80 : 150;
            const maxSize = isMobile ? 200 : 400;

            // Safe zone in center (percentage)
            const safeZone = {
                top: 30,
                bottom: 70,
                left: 20,
                right: 80
            };

            for (let i = 0; i < count; i++) {
                let valid = false;
                let attempts = 0;
                let bubble = null;

                while (!valid && attempts < 1000) {
                    const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
                    const top = Math.random() * 90; // Limit to 90% to avoid overflow
                    const left = Math.random() * 90;
                    
                    const bubbleCenterX = (left * winWidth / 100) + (size / 2);
                    const bubbleCenterY = (top * winHeight / 100) + (size / 2);
                    const radius = size / 2;
                    
                    const safeZoneLeftPx = (safeZone.left * winWidth / 100) - radius;
                    const safeZoneRightPx = (safeZone.right * winWidth / 100) + radius;
                    const safeZoneTopPx = (safeZone.top * winHeight / 100) - radius;
                    const safeZoneBottomPx = (safeZone.bottom * winHeight / 100) + radius;

                    const inSafeZone = 
                        bubbleCenterX > safeZoneLeftPx && 
                        bubbleCenterX < safeZoneRightPx && 
                        bubbleCenterY > safeZoneTopPx && 
                        bubbleCenterY < safeZoneBottomPx;

                    // Check overlap with existing bubbles
                    let overlaps = false;
                    for (const other of newBubbles) {
                        const otherCenterX = (other.left * winWidth / 100) + (other.size / 2);
                        const otherCenterY = (other.top * winHeight / 100) + (other.size / 2);

                        const dx = bubbleCenterX - otherCenterX;
                        const dy = bubbleCenterY - otherCenterY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const minDistance = (size / 2) + (other.size / 2) + 20; // +20px padding

                        if (distance < minDistance) {
                            overlaps = true;
                            break;
                        }
                    }
                    
                    if (!inSafeZone && !overlaps) {
                       valid = true;
                       bubble = {
                           id: i,
                           top,
                           left,
                           size,
                           speed: (Math.random() * 0.8) + 0.2
                       };
                    }
                    attempts++;
                }

                if (bubble) {
                    newBubbles.push(bubble);
                }
            }
            setBubbles(newBubbles);
        };

        generateBubbles();
    }, []);

    return { bubbles, scrollY };
};
