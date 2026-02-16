import { motion } from "framer-motion";

interface ProjectProps {
    projectTitle: string;
    projectImage: string;
}

const ProjectCard = ({ projectTitle, projectImage }: ProjectProps) => {

    return (
        <motion.div
            className="flex flex-col w-full max-w-60 h-48 md:h-60 rounded-3xl overflow-hidden shadow-lg mx-auto"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="h-[75%] w-full bg-gray-300">
                <img
                    src={projectImage}
                    alt={projectTitle}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="h-[25%] w-full bg-[#57534E] flex items-center justify-center px-2">
                <span className="text-white font-bold text-sm md:text-md text-center">{projectTitle}</span>
            </div>
        </motion.div>
    );
};

export default ProjectCard;