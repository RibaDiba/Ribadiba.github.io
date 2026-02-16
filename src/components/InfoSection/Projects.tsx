import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { projects, Project } from "@/stores/Projects";
import ProjectCard from "../ProjectPage/ProjectCard";
import ProjectModal from "../ProjectPage/ProjectModal";

const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.1,
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

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <>
            <motion.div
                className="flex flex-col text-center gap-8 md:gap-12 items-center px-4"
                style={{ color: "#57534E" }}
                variants={containerVariants}
            >
                <motion.div
                    className="text-4xl md:text-8xl leading-none font-bold"
                    variants={itemVariants}
                >
                    Projects.
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
                    variants={containerVariants}
                >
                    {projects.map((project, index) => (
                        <motion.div 
                            key={index} 
                            variants={itemVariants} 
                            className="cursor-pointer"
                            onClick={() => setSelectedProject(project)}
                        >
                            <ProjectCard 
                                projectTitle={project.projectTitle} 
                                projectImage={project.projectFrontImage}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Projects;