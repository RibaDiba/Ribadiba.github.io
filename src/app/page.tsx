import AbirOSMobile from "@/components/Redesign/AbirOSMobile";
import DesktopSection from "@/components/Redesign/DesktopSection";

const Home = () => {
    return (
        <>
            <div className="md:hidden">
                <AbirOSMobile />
            </div>
            <div className="hidden md:block">
                <DesktopSection />
            </div>
        </>
    );
};

export default Home;
