
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
        projectTitle: "Raspberry Pi Omni-Directional EV",
        projectFrontImage: getAssetPath("/ProjectImages/Pi_Car_Cover.png"),
        projectDescription: [
            "Developed for the Odyssey of the Mind competition, this rideable electric vehicle serves as a core theatrical prop requiring precise mobility and high load-bearing capacity.",
            "Engineered a custom C++ control interface for Nintendo Joy-Con controllers via Bluetooth HID. Since no standard library existed for this specific implementation on Raspberry Pi, the project involved reverse-engineering Joy-Con HID reports to create a low-latency input pipeline. Motor control was managed through WiringPi, interfacing directly with high-torque e-scooter motor controllers.",
            "The drivetrain utilizes four e-scooter motors coupled with heavy-duty omnidirectional wheels. This configuration enables zero-radius turning and complex lateral movement, providing the maneuverability required for stage performances.",
            "The power system consists of dual 12V lead-acid car batteries wired in series (24V), optimized for sustained high-current delivery during a 10-minute performance cycle."
        ],
        projectImages: [
            "https://youtu.be/HSFzfCUV7-w",
            ""
        ],
        skills: ["C++", "Raspberry Pi", "ESP32", "Embedded Systems"],
        ghLink: "https://github.com/RibaDiba/pi-electric-car"
    },
    {
        projectTitle: "Leastudo",
        projectFrontImage: getAssetPath("/ProjectImages/Leastudo_Cover.png"),
        projectDescription: [
            "Leastudo is a specialized subleasing marketplace designed to solve housing inefficiencies within the UMD student ecosystem. The platform facilitates peer-to-peer lease transfers for students facing graduating early or seasonal displacement.",
            "Built on a modern MERN stack with a Next.js frontend architecture. I led the UI/UX design and frontend implementation, integrating the Google Maps API for spatial discovery and developing a secure student authentication flow.",
            "The project is developed under TerpLabs, a student-led organization at UMD dedicated to building high-impact software solutions for the campus community."
        ],
        projectImages: [
            getAssetPath("/ProjectImages/Leastudo_Cover.png"),
            getAssetPath("/ProjectImages/TerpLabsLogo.webp")
        ],
        skills: ["Next.js", "Figma", "React", "MongoDB"]
    },
    {
        projectTitle: "Automated Background Display System (BDS)",
        projectFrontImage: getAssetPath("/ProjectImages/BDS_Cover.png"),
        projectDescription: [
            "An automated stage-set transition system designed for the Odyssey of the Mind competition, utilizing rotating triangular prism modules to showcase three distinct high-resolution backdrops.",
            "Implemented a distributed control system using peer-to-peer ESP32 communication. A master controller synchronizes multiple high-torque stepper motor units to ensure perfectly aligned panel rotations. Stepper motors were selected for their high holding torque and precise angular positioning.",
            "The custom-built control interface features tactile mechanical switches and status LEDs, providing the stage crew with a reliable and intuitive method for executing background transitions."
        ],
        projectImages: [
            "https://youtu.be/QHsplba29P4",
            getAssetPath("/ProjectImages/BDS_Sketch.jpg")
        ], 
        skills: ["C++", "ESP32", "Distributed Systems"],
        ghLink: "https://github.com/RibaDiba/Background-Display-System-Arduino"
    },
    {
        projectTitle: "Servo-Actuated Kinetic Shield",
        projectFrontImage: getAssetPath("/ProjectImages/Shield_Cover.png"),
        projectDescription: [
            "A high-speed kinetic prop designed for theatrical use, featuring a rapid-deployment expansion mechanism activated via embedded triggers.",
            "The mechanism utilizes a high-torque servo motor integrated with 3D-printed mechanical linkages and laser-cut wooden panels. A high-tension string rigging system was engineered to facilitate smooth, synchronized expansion across multiple segments.",
            "System logic is managed by an ESP32 microcontroller, ensuring predictable actuation timing and robust debounce handling for the physical trigger interface.",
            "The final assembly involved rigorous mechanical stress testing followed by thematic aesthetic finishing for stage integration."
        ],
        projectImages: [
            "https://youtu.be/pXhrgKOtZv8",
            getAssetPath("/ProjectImages/Sketch_Shield.jpg")
        ],
        skills: ["C++", "ESP32", "Mechatronics"],
    },
    {
        projectTitle: "Autonomous Navigation Robot",
        projectFrontImage: getAssetPath("ProjectImages/Robot_Tour_Cover.png"),
        projectDescription: [
            "Developed for the Science Olympiad 'Robot Tour' event, this autonomous platform is engineered to navigate complex path-based mazes with high temporal and spatial accuracy.",
            "Achieved precise navigational control through a custom PID (Proportional-Integral-Derivative) algorithm, utilizing high-resolution quadrature encoders for real-time wheel telemetry and closed-loop feedback.",
            "The robot was programmed to execute sequential checkpoint traversal within a strictly defined time window, maintaining sub-centimeter accuracy at the final target point.",
            "The project placed 3rd at the state-level competition, validating the robustness of the motion control algorithms and sensor fusion logic."
        ],
        projectImages: [
            "https://youtu.be/5f8AOf_gfC4",
            getAssetPath("/ProjectImages/Scioly_Map.png")
        ],
        skills: ["C++", "PID Control", "Embedded Systems"],
        ghLink: "https://github.com/RibaDiba/robot-tour"
    },
    {
        projectTitle: "High-Precision Electric Vehicle",
        projectFrontImage: getAssetPath("/ProjectImages/EV Model.png"),
        projectDescription: [
            "A competitive speed-and-accuracy vehicle engineered for the Science Olympiad 'Electric Vehicle' event, designed to reach specific targets up to 10 meters with minimal deviation.",
            "Utilized a custom bevel-gear drivetrain to maximize power transfer efficiency and achieve high acceleration. Motion profiles were governed by a PID control system to ensure precise braking at the target distance.",
            "All structural components were modeled in Onshape and 3D printed for optimal weight-to-strength ratios and aerodynamic efficiency.",
            "The vehicle placed 8th at the state-level competition, showcasing effective integration of CAD-driven design and embedded control systems."
        ],
        projectImages: [
            "https://youtu.be/4vl85nk9v38",
            getAssetPath("/ProjectImages/EV Model.png")
        ],
        skills: ["C++", "OnShape", "PID Control", "3D Printing"],
        ghLink: "https://github.com/RibaDiba/electric-vehicle"
    }
];