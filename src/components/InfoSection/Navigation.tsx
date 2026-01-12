

import { Links } from "@/stores/Links";
import { getAssetPath } from "@/utils/paths";

const Navigation = ({ active, setActive }: { active: string; setActive: (page: string) => void }) => {

    const handleSetActive = (page: string) => {
        setActive(page);
    }

    const isActive = (page: string) => active === page;

    return (
        <div className="flex h-full w-full flex-col justify-between py-[100px] pl-[100px] font-bold">

            {/* pfp with circle */} 
            <div className="relative h-[250px] w-[250px]">
                <div className="absolute top-[20px] left-[10px] h-[250px] w-[250px] rounded-full bg-[#57534E]"></div>
                <div className="absolute top-0 left-0 h-[250px] w-[250px] rounded-full overflow-hidden border-4 border-[#57534E]">
                    <img src={getAssetPath("/PFP.png")} alt="Profile" className="h-full w-full object-cover" />
                </div>
            </div>

            <div className="flex flex-col items-start gap-4 text-5xl text-gray-500">
                <button 
                    onClick={() => handleSetActive("About Me")}
                    className={`${isActive("About Me") ? "text-black" : "hover:text-black transition-colors"}`}
                >
                    <div className="cursor-pointer">About Me.</div>
                </button>

                <button 
                    onClick={() => handleSetActive("Skills")}
                    className={`${isActive("Skills") ? "text-black" : "hover:text-black transition-colors"}`}
                >
                    <div className="cursor-pointer">Skills.</div>
                </button>

                <button 
                    onClick={() => handleSetActive("Projects")}
                    className={`${isActive("Projects") ? "text-black" : "hover:text-black transition-colors"}`}
                >
                    <div className="cursor-pointer">Projects.</div>
                </button>
            </div>

            {/* socials */}
            <div className="flex gap-6">
                <a href={Links.GithubLink}>
                    <img src={getAssetPath("/Socials_Gray/Github.png")} alt="Github" className="h-12 w-auto" />
                </a>
                <a href={Links.LinkedinLink}>
                    <img src={getAssetPath("/Socials_Gray/Linkedin.png")} alt="LinkedIn" className="h-12 w-auto" />
                </a>
                <a href={Links.InstaGramLink}>
                    <img src={getAssetPath("/Socials_Gray/Instagram.png")} alt="Instagram" className="h-12 w-auto" />
                </a>
            </div>

        </div>
    )
};

export default Navigation;