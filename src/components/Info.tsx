"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./InfoSection/Navigation";
import AboutMe from "./InfoSection/AboutMe";
import Skills from "./InfoSection/Skills";
import Projects from "./InfoSection/Projects";

const Info = () => {

    const [active, setActive] = useState<string>("About Me");

    const wrapperVariants = {
        initial: { y: "100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "-100%", opacity: 0 }
    };

    return (

        <>
            <div className="flex flex-col md:flex-row h-full w-full bg-[#D9D9D9]">
                <div className="h-auto md:h-full w-full md:w-1/4">
                    <Navigation active={active} setActive={setActive}/>
                </div>

                <div className="flex w-full md:w-3/4 items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        {active === "About Me" && (
                            <motion.div
                                key="About Me"
                                variants={wrapperVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="w-full flex justify-center"
                            >
                                <AboutMe />
                            </motion.div>
                        )}
                        {active === "Skills" && (
                            <motion.div
                                key="Skills"
                                variants={wrapperVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="w-full flex justify-center"
                            >
                                <Skills />
                            </motion.div>
                        )}
                        {active === "Projects" && (
                            <motion.div
                                key="Projects"
                                variants={wrapperVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="w-full flex justify-center"
                            >
                                <Projects />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
};

export default Info;