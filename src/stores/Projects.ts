
import { getAssetPath } from "@/utils/paths";

/**
 * interface that will help with organizing the projects 
 * 
 * @param projectTitle title for the project 
 * @param projectFrontImage cover image for the project 
 * @param projectDescription contains 2 different paragraphs 
 * @param projectImages contains 2 different images/videos 
 * @param skills contains a list of skills for the project 
 * @param ghLink has the link to the project's github 
 */
export interface Project {
    projectTitle: string, 
    projectFrontImage: string, 
    projectDescription?: string[], 
    projectImages?: string[],
    skills?: string[],
    ghLink?: string
}

export const projects: Project[] = [
    {
        projectTitle: "Raspberry Pi Rideable Car",
        projectFrontImage: getAssetPath("/ProjectImages/Pi_Car_Cover.png"),
        projectDescription: [
            "Odyssey of the Mind is a HS competition where teams of 7 come together to make a theatrical play. This project showcases a rideable electric vehicle that is used in the play.",
            "For control, a raspberry pi with a connected Joycon is used with a bluetooth interface. The bluetooth interface was written in C++ using documentation from reverse engineering a Joycon as a bluetooth library for raspberry pi does not exist to use Joycons. WiringPi was used to interface with the motor controllers.",
            "For our drive train, we used 4 e-scooter motors and omnidirectional wheels. Four motors allowed for power to drive one person and omnidirectional wheels allowed for the vehicle to turn in place, a feature crucial for our play.",
            "To power our vehicle, we put two car batteries in series, giving us a 10 minute lifespan while also powering 24 volts."
        ],
        projectImages: [
            "https://youtu.be/HSFzfCUV7-w",
            ""
        ],
        skills: ["C++", "RaspberryPi, ESP32"],
        ghLink: "https://github.com/RibaDiba/pi-electric-car"
    },
    {
        projectTitle: "Leastudo",
        projectFrontImage: getAssetPath("/ProjectImages/Leastudo_Cover.png"),
        projectDescription: [
            "Upperclassmen housing at UMD is privatized, requiring students to sign leases for apartments. However there are cases where students need to find housing for just a semester, or are graduating early and need someone to fill their lease. We are building an apartment subleasing platform for UMD students to match students that want to rent out their room to students that need housing.",
            "We are using the MERN tech stack with Next.js. I am working on the frontend and contributing to the UI design. Google maps API integration, student authentication, and student matching are some features that we hope to ship out by the spring 2026 semester.",
            "We are a team built through the terplabs organization at UMD, a student organization that helps support software for the student body."
        ],
        projectImages: [
            getAssetPath("/ProjectImages/Leastudo_Cover.png"),
            getAssetPath("/ProjectImages/TerpLabsLogo.webp")
        ],
        skills: ["Next.js", "Figma", "React"]
    },
    {
        projectTitle: "Background Display System",
        projectFrontImage: getAssetPath("/ProjectImages/BDS_Cover.png"),
        projectDescription: [
            "Odyssey of the Mind is a HS competition where teams of 7 come together to make a theatrical play. This project showcases an automatic display of backdrops through rotating triangular prisms.",
            "For control, I developed a controller using a peer ESP32 controller to communicate with 2 master ESP32s that control the stepper motors. Our choice of stepper motors gives us precise control over how each panel would rotate.",
            "The controller had keyboard switches and led lights, which would make the process of switching between backgrounds straightforward."
        ],
        projectImages: [
            "https://youtu.be/QHsplba29P4",
            getAssetPath("/ProjectImages/BDS_Sketch.jpg")
        ], 
        skills: ["C++", "ESP32"],
        ghLink: "https://github.com/RibaDiba/Background-Display-System-Arduino"
    },
    {
        projectTitle: "Expandable Shield",
        projectFrontImage: getAssetPath("/ProjectImages/Shield_Cover.png"),
        projectDescription: [
            "Odyssey of the Mind is a HS competition where teams of 7 come together to make a theatrical play. This project showcases an expandable shield that creates protection on a button press.",
            "A servo motor is connected to 3d printed components and wooden panels. These panels are connected together with strings. The wooden panels that make up the shield are laser cut to ensure precision.",
            "An ESP32 chip is used to interface between the servo motor and button, allowing for predictable control.",
            "Paint and decorations were added to the shield after production to be incorporated into our play."
        ],
        projectImages: [
            "https://youtu.be/pXhrgKOtZv8",
            getAssetPath("/ProjectImages/Sketch_Shield.jpg")
        ],
        skills: ["C++", "ESP32"],
    },
    {
        projectTitle: "Robot Tour",
        projectFrontImage: getAssetPath("ProjectImages/Robot_Tour_Cover.png"),
        projectDescription: [
            "This project is for the 'Robot Tour' event in the Science Olympiad competition. The event requires a small robot to traverse a path through a maze, meeting at certain checkpoints along the way. There are a few extra guidelines to this problem.",
            "The robot must achieve checkpoint locations and do so in a specific order (i.e., A->B->C). The robot has to complete the maze in a specified time (e.g., the robot must complete the maze in 72 seconds). Finally, the robot must reach the target point with accuracy.",
            "We achieved precision with our movements through PID control, which was implemented using a quadrature motor encoder on each wheel. We were able to make accurate turns alongside other movements.",
            "I provided a sample map to the left. We placed 3rd at the state-level competition."
        ],
        projectImages: [
            "https://youtu.be/5f8AOf_gfC4",
            getAssetPath("/ProjectImages/Scioly_Map.png")
        ],
        skills: ["C++", "ESP32"],
        ghLink: "https://github.com/RibaDiba/robot-tour"
    },
    {
        projectTitle: "Electric Vehicle",
        projectFrontImage: getAssetPath("/ProjectImages/EV Model.png"),
        projectDescription: [
            "This project is for the 'Electric Vehicle' event in the Science Olympiad competition. The event requires a small robot to reach a specified point between 7 and 10 meters in the fastest time (e.g., 8.24 m).",
            "Using PID control, we achieved a high level of accuracy, and through the bevel-gear motor setup we also achieved speed.",
            "All non-electronic parts (other than tire treads) were designed in Onshape and 3D printed. I provided a screenshot of the Onshape file for reference. We placed 8th at the state-level competition."
        ],
        projectImages: [
            "https://youtu.be/4vl85nk9v38",
            getAssetPath("/ProjectImages/EV Model.png")
        ],
        skills: ["C++", "ESP32", "OnShape"],
        ghLink: "https://github.com/RibaDiba/electric-vehicle"
    }
];