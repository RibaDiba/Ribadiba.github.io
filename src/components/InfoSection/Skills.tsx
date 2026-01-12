import { motion, Variants } from "framer-motion";
import { getAssetPath } from "@/utils/paths";

const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

const itemVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
        y: -20,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" }
    }
};

const Hexagon = ({ image, alt }: { image: string, alt: string }) => (
    <motion.div 
        className="w-40 h-40 flex items-center justify-center relative"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg absolute top-0 left-0" style={{ color: "#57534E" }}>
             <path 
                d="M50 5 L90 28 V72 L50 95 L10 72 V28 Z" 
                fill="currentColor" 
                stroke="currentColor" 
                strokeWidth="10" 
                strokeLinejoin="round" 
            />
        </svg>
        <div className="relative z-10 w-20 h-20 flex items-center justify-center">
             <img src={getAssetPath(image)} alt={alt} className="w-full h-full object-contain" />
        </div>
    </motion.div>
);

const Skills = () => {
    return (
        <motion.div 
            className="flex flex-col items-center gap-12"
            variants={containerVariants}
        >
            <motion.div 
                className="text-8xl font-bold" 
                style={{ color: "#57534E" }}
                variants={itemVariants}
            >
                Skills.   
            </motion.div>

            <motion.div className="flex flex-col items-center -space-y-4" variants={containerVariants}>
                 {/* Row 1 */}
                <motion.div className="flex gap-4" variants={containerVariants}>
                    <motion.div variants={itemVariants}><Hexagon image="/logos_skills/svelte.png" alt="Svelte" /></motion.div>
                    <motion.div variants={itemVariants}><Hexagon image="/logos_skills/react.png" alt="React" /></motion.div>
                    <motion.div variants={itemVariants}><Hexagon image="/logos_skills/next.svg" alt="Next.js" /></motion.div>
                </motion.div>
                 {/* Row 2 */}
                <motion.div className="flex gap-4" variants={containerVariants}>
                    <motion.div variants={itemVariants}><Hexagon image="/logos_skills/javascript.png" alt="JavaScript" /></motion.div>
                    <motion.div variants={itemVariants}><Hexagon image="/logos_skills/c++.png" alt="C++" /></motion.div>
                    <motion.div variants={itemVariants}><Hexagon image="/logos_skills/python.png" alt="Python" /></motion.div>
                    <motion.div variants={itemVariants}><Hexagon image="/logos_skills/java.png" alt="Java" /></motion.div>
                </motion.div>
                 {/* Row 3 */}
                <motion.div className="flex gap-4" variants={containerVariants}>
                    <motion.div variants={itemVariants}><Hexagon image="/logos_skills/arduino.svg" alt="Arduino" /></motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
};

export default Skills;
