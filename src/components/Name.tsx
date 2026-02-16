"use client";

import { motion } from "framer-motion";
import { useBubbles } from "../hooks/useBubbles";
import { Links } from "@/stores/Links";
import { getAssetPath } from "@/utils/paths";

const Name = () => {
    const { bubbles, scrollY } = useBubbles();

    return (
        <>
            <div 
                className="relative h-screen w-full overflow-hidden bg-[#57534E]"
            >
                {/* Bubbles */}
                {bubbles.map((bubble) => (
                    <div 
                        key={bubble.id}
                        style={{ 
                            transform: `translateY(${scrollY * bubble.speed}px)`,
                            top: `${bubble.top}%`,
                            left: `${bubble.left}%`
                        }}
                        className="absolute"
                    >
                        <motion.div 
                            style={{
                                width: `${bubble.size}px`,
                                height: `${bubble.size}px`
                            }}
                            className="rounded-full bg-[#D9D9D9]" 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                                duration: 0.5, 
                                ease: "easeOut",
                                scale: { type: "spring", stiffness: 300 } // specific transition for hover
                            }}
                            whileHover={{ scale: 1.1 }}
                        />
                    </div>
                ))}

                {/* Content */}
                <div className="animate-fade-in relative z-10 flex h-full w-full flex-col items-center justify-center gap-8 md:gap-15 text-orange-200 text-4xl sm:text-6xl md:text-8xl lg:text-9xl pointer-events-none px-4">
                    <div className="pointer-events-auto text-center">Abir Modak</div>
                    <div className="flex gap-4 md:gap-8 pointer-events-auto">
                        <a href={Links.GithubLink}>
                            <img src={getAssetPath("/Socials_Orange/Github.png")} alt="Github" className="w-12 h-12 md:w-16 md:h-16" />
                        </a>
                        <a href={Links.LinkedinLink}>
                            <img src={getAssetPath("/Socials_Orange/Linkedin.png")} alt="LinkedIn" className="w-12 h-12 md:w-16 md:h-16" />
                        </a>
                        <a href={Links.InstaGramLink}>
                            <img src={getAssetPath("/Socials_Orange/Instagram.png")} alt="Instagram" className="w-12 h-12 md:w-16 md:h-16" />
                        </a>
                    </div>
                </div>

                <div className="animate-fade-in absolute bottom-4 left-4 z-10 text-xl text-white sm:bottom-8 sm:left-8 md:text-4xl">
                    Scroll &gt;
                </div>
            </div>
        </>
    )
};

export default Name;