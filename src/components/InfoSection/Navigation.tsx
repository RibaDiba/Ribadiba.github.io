

import { Links } from "@/stores/Links";
import { getAssetPath } from "@/utils/paths";

const Navigation = ({ active, setActive }: { active: string; setActive: (page: string) => void }) => {

    const handleSetActive = (page: string) => {
        setActive(page);
    }

    const isActive = (page: string) => active === page;

    return (
        <div className="flex h-full w-full flex-col md:flex-col justify-between py-6 px-6 md:py-25 md:pl-25 font-bold">

            {/* pfp with circle */}
            <div className="relative h-44 w-44 md:h-62.5 md:w-62.5 mx-auto md:mx-0">
                <div className="absolute top-2 left-1 md:top-5 md:left-2.5 h-44 w-44 md:h-62.5 md:w-62.5 rounded-full bg-[#57534E]"></div>
                <div className="absolute top-0 left-0 h-44 w-44 md:h-62.5 md:w-62.5 rounded-full overflow-hidden border-4 border-[#57534E]">
                    <img src={getAssetPath("/PFP.png")} alt="Profile" className="h-full w-full object-cover" />
                </div>
            </div>

            <div className="hidden md:flex flex-row md:flex-col items-center md:items-start justify-center gap-2 md:gap-4 text-2xl md:text-5xl text-gray-500">
                <button
                    onClick={() => handleSetActive("About Me")}
                    className={`${isActive("About Me") ? "text-black" : "hover:text-black transition-colors"}`}
                >
                    <div className="cursor-pointer">About Me.</div>
                </button>

                {/* Hide Skills and Projects on mobile */}
                <button
                    onClick={() => handleSetActive("Skills")}
                    className={`hidden md:block ${isActive("Skills") ? "text-black" : "hover:text-black transition-colors"}`}
                >
                    <div className="cursor-pointer">Skills.</div>
                </button>

                <button
                    onClick={() => handleSetActive("Projects")}
                    className={`hidden md:block ${isActive("Projects") ? "text-black" : "hover:text-black transition-colors"}`}
                >
                    <div className="cursor-pointer">Projects.</div>
                </button>
            </div>

            {/* socials */}
            <div className="hidden md:flex gap-4 md:gap-6 justify-center md:justify-start">
                <a href={Links.GithubLink}>
                    <img src={getAssetPath("/Socials_Gray/Github.png")} alt="Github" className="h-8 md:h-12 w-auto" />
                </a>
                <a href={Links.LinkedinLink}>
                    <img src={getAssetPath("/Socials_Gray/Linkedin.png")} alt="LinkedIn" className="h-8 md:h-12 w-auto" />
                </a>
                <a href={Links.InstaGramLink}>
                    <img src={getAssetPath("/Socials_Gray/Instagram.png")} alt="Instagram" className="h-8 md:h-12 w-auto" />
                </a>
            </div>

        </div>
    )
};

export default Navigation;