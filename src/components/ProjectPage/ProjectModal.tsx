import { motion } from "framer-motion";
import { Project } from "@/stores/Projects";

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
}

const Typewriter = ({ text, delay = 0.5 }: { text: string; delay?: number }) => {
    return (
        <motion.p
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        delayChildren: delay,
                        staggerChildren: 0.0035
                    }
                }
            }}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0 } }
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.p>
    );
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
    const { projectTitle, projectDescription, projectImages } = project;

    const renderMedia = (src: string | undefined, alt: string) => {
        if (!src) return <div className="h-full w-full bg-[#D9D9D9]" />;
        
        // Check for YouTube
        if (src.includes("youtube.com") || src.includes("youtu.be")) {
            let videoId = "";
            if (src.includes("youtube.com/watch?v=")) {
                videoId = src.split("v=")[1].split("&")[0];
            } else if (src.includes("youtu.be/")) {
                videoId = src.split("youtu.be/")[1].split("?")[0];
            }
            
            if (videoId) {
                return (
                    <iframe 
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="h-full w-full object-contain"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                );
            }
        }

        const isVideo = src.toLowerCase().match(/\.(mp4|webm|mov)$/);
        
        if (isVideo) {
            return (
                <video 
                    src={src} 
                    className="h-full w-full object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                />
            );
        }
        
        return <img src={src} alt={alt} className="h-full w-full object-contain" />;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
                className="relative z-10 w-full max-w-5xl max-h-[90vh] md:aspect-4/3 flex flex-col overflow-hidden rounded-2xl md:rounded-3xl bg-[#57534E] text-white shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
            >
                {/* Header */}
                <div className="relative flex items-center justify-center border-b border-white/10 p-4 md:p-6 shrink-0">
                    <h2 className="text-xl md:text-3xl font-bold text-center pr-8">{projectTitle}</h2>
                    <motion.button
                        onClick={onClose}
                        className="absolute right-3 top-3 md:right-6 md:top-6 rounded-full p-1 hover:bg-white/10 transition-colors text-orange-200 cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-8 md:h-8">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </motion.button>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 gap-4 md:gap-8 p-4 md:p-8 md:grid-cols-2 flex-1 overflow-auto">
                    {/* Left Column - Images */}
                    <div className="flex flex-col gap-3 md:gap-6 px-2 md:px-4">
                        {/* Image 1 */}
                        <motion.div
                            className="aspect-video w-full overflow-hidden rounded-lg md:rounded-xl bg-[#D9D9D9]"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {renderMedia(projectImages?.[0], "Project detail 1")}
                        </motion.div>
                        {/* Image 2 */}
                        <motion.div
                            className="aspect-video w-full overflow-hidden rounded-lg md:rounded-xl bg-[#D9D9D9]"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {renderMedia(projectImages?.[1], "Project detail 2")}
                        </motion.div>
                    </div>

                    {/* Right Column - Text */}
                    <div className="flex flex-col gap-4 md:gap-6 text-gray-200 font-semibold overflow-y-auto text-sm md:text-lg">
                        {(() => {
                            const speed = 0.0035; // match staggerChildren
                            const initialDelay = 0.5;

                            if (Array.isArray(projectDescription)) {
                                let accumulatedDelay = initialDelay;
                                return projectDescription.map((desc, i) => {
                                    const element = <Typewriter key={i} text={desc} delay={accumulatedDelay} />;
                                    accumulatedDelay += (desc.length * speed);
                                    return element;
                                });
                            } else if (typeof projectDescription === 'string') {
                                return <Typewriter text={projectDescription} delay={initialDelay} />;
                            } else {
                                const text1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tristique varius mauris, sit amet mollis sapien aliquam vel. Mauris blandit nisl eu lorem sodales varius. Sed nec justo vel massa vulputate tristique a vel risus. Sed sed porta sem, quis lobortis sapien. Suspendisse nec nunc ut libero rutrum accumsan nec in lorem. Sed sed porta sem, quis lobortis sapien. Suspendisse nec nunc ut libero rutrum accumsan nec in lorem.";
                                const text2 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tristique varius mauris, sit amet mollis sapien aliquam vel. Mauris blandit nisl eu lorem sodales varius. Sed nec justo vel massa vulputate tristique a vel risus. Sed sed porta sem, quis lobortis sapien. Suspendisse nec nunc ut libero rutrum accumsan nec in lorem. Sed sed porta sem, quis lobortis sapien. Suspendisse nec nunc ut libero rutrum accumsan nec in lorem.";
                                
                                const delay2 = initialDelay + (text1.length * speed);
                                
                                return (
                                    <>
                                        <Typewriter text={text1} delay={initialDelay} />
                                        <Typewriter text={text2} delay={delay2} />
                                    </>
                                );
                            }
                        })()}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 bg-[#D9D9D9] p-4 md:p-6 shrink-0">
                    <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
                        {/* Placeholder Skills */}
                            { project.skills && project.skills.map((skill, i) => (
                                <motion.span
                                    key={i}
                                    className="rounded-full bg-[#57534E] px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white shadow-sm"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                    </div>
                    {project.ghLink && (
                        <a href={project.ghLink}>
                            <motion.button
                                className="rounded-full bg-[#57534E] px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base font-bold text-white shadow-sm hover:bg-[#44403c] transition-colors cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                &lt;Code /&gt;
                            </motion.button>
                        </a>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectModal;
