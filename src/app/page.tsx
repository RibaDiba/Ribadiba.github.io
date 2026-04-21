import BioSection from "@/components/Redesign/BioSection";
import DesktopSection from "@/components/Redesign/DesktopSection";
import HeroSection from "@/components/Redesign/HeroSection";

const Home = () => {
    return (
        <>
            <HeroSection />
            <BioSection />
            <div className="hidden md:block">
                <DesktopSection />
            </div>
        </>
    );
};

export default Home;
