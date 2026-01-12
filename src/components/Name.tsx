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
                <div className="animate-fade-in relative z-10 flex h-full w-full flex-col items-center justify-center gap-[60px] text-orange-200 text-9xl pointer-events-none">
                    <div className="pointer-events-auto">Abir Modak</div>
                    <div className="flex gap-[32px] pointer-events-auto">
                        <a href={Links.GithubLink}>
                            <img src={getAssetPath("/Socials_Orange/Github.png")} alt="Github" />
                        </a>
                        <a href={Links.LinkedinLink}>
                            <img src={getAssetPath("/Socials_Orange/Linkedin.png")} alt="LinkedIn" />
                        </a>
                        <a href={Links.InstaGramLink}>
                            <img src={getAssetPath("/Socials_Orange/Instagram.png")} alt="Instagram" />
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