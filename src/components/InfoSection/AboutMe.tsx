import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.15,
            staggerDirection: -1
        }
    }
};

const itemVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: {
        y: -20,
        opacity: 0,
        transition: { duration: 0.5, ease: "easeIn" }
    }
};

const AboutMe = () => {
    return (
        <motion.div
            className="flex flex-col text-center gap-16 md:gap-32 justify-center items-center px-6 md:px-4 py-8 md:py-0"
            variants={containerVariants}
        >
            <motion.div
                className="text-5xl md:text-8xl leading-none font-bold"
                style={{ color: "#57534E" }}
                variants={itemVariants}
            >
                About Me.
            </motion.div>

            <motion.div
                className="flex items-center flex-col gap-10 md:gap-21 text-lg md:text-2xl mx-0 md:mx-64 max-w-2xl md:max-w-none"
                variants={containerVariants}
            >

                <motion.div
                    className="text-center text-[#57534E] max-w-5xl font-semibold"
                    variants={itemVariants}
                >
                    Hey! I'm Abir Modak, I'm a computer science major at <span className="font-bold text-black">Maryland, College Park</span>
                </motion.div>

                <motion.div
                    className="w-7/8 h-1 bg-[#57534E] rounded-full"
                    variants={itemVariants}
                />

                <motion.div
                    className="text-center text-[#57534E] max-w-5xl font-semibold leading-normal"
                    variants={itemVariants}
                >
                    I have experience building web apps with <span className="font-bold text-black">Next.js</span> and <span className="font-bold text-black">Svelte</span>.
                    I also work with open source vision frameworks such as <span className="font-bold text-black">Detectron2</span>.
                    I also have some <span className="font-bold text-black">embedded systems</span> work on my GitHub!
                </motion.div>

                {/* Mobile-only desktop prompt */}
                <motion.div
                    className="md:hidden mt-8 px-6 py-4 bg-[#57534E] rounded-2xl text-white text-center font-semibold"
                    variants={itemVariants}
                >
                    <div className="text-lg mb-2">💻 Full Experience Available</div>
                    <div className="text-sm opacity-90">
                        View on desktop to see my full portfolio, skills, and projects!
                    </div>
                </motion.div>

            </motion.div>
        </motion.div>
    )
};

export default AboutMe;