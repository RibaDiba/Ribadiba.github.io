import { getAssetPath } from "@/utils/paths";

export const portfolioFileTypes = ["img", "code", "paper", "game"] as const;
export type PortfolioFileType = (typeof portfolioFileTypes)[number];

export const portfolioMediaTypes = ["image", "video", "document"] as const;
export type PortfolioMediaType = (typeof portfolioMediaTypes)[number];

export type PortfolioMediaSource = "local" | "external";

export interface PortfolioMediaAsset {
    type: PortfolioMediaType;
    source: PortfolioMediaSource;
    src: string;
    alt?: string;
}

export interface PortfolioPreviewImage {
    source: PortfolioMediaSource;
    src: string;
    alt?: string;
}

export interface PortfolioFileData {
    title: string;
    role: string;
    year: string;
    stack: string[];
    blurb: string;
    notes: string;
    tags: string[];
    link: string;
    previewImage?: PortfolioPreviewImage;
    mediaAssets: PortfolioMediaAsset[];
}

export interface PortfolioFolderNode {
    id: string;
    label: string;
    kind: "folder";
    children: PortfolioFileNode[];
}

export interface PortfolioFileNode {
    id: string;
    label: string;
    kind: "file";
    fileType: PortfolioFileType;
    data: PortfolioFileData;
}

export type PortfolioDesktopNode = PortfolioFolderNode | PortfolioFileNode;

const localMedia = (src: string, type: PortfolioMediaType, alt?: string): PortfolioMediaAsset => ({
    type,
    source: "local",
    src: getAssetPath(src),
    alt
});

const externalMedia = (src: string, type: PortfolioMediaType, alt?: string): PortfolioMediaAsset => ({
    type,
    source: "external",
    src,
    alt
});

const localPreview = (src: string, alt?: string): PortfolioPreviewImage => ({
    source: "local",
    src: getAssetPath(src),
    alt
});

export const retroDesktopPortfolioNodes: PortfolioDesktopNode[] = [
    {
        id: "Hardware",
        label: "Hardware",
        kind: "folder",
        children: [
            {
                id: "Pi Electric Car",
                label: "Car.proj",
                kind: 'file',
                fileType: "code",
                data: {
                    title: "Raspberry Pi Omni-Directional EV",
                    role: "Lead Systems Developer",
                    year: "2024-2025",
                    stack: ["Raspberry PI", "ESP32", "C++", "Bluetooth HID"],
                    blurb: "A rideable electric vehicle utilizing a Raspberry Pi and ESP32 architecture for real-time control. Features an omni-directional drivetrain powered by dual 12V lead-acid batteries and integrated with Nintendo Joy-Con controllers via Bluetooth/HID.",
                    notes: "Engineered for the Odyssey of the Mind competition, focusing on hardware-software integration, power management, and low-latency motor control.",
                    tags: ["Embedded Systems", "Robotics", "C++"],
                    link: "https://github.com/RibaDiba/pi-electric-car",
                    previewImage: localPreview("/ProjectImages/Pi_Mockup.png", "Car Cad Design"),
                    mediaAssets: [
                        externalMedia("https://youtu.be/HSFzfCUV7-w", "video", "Electric car demo")
                    ]
                }
            },
            {
                id: "Background Display System",
                label: "BDS.proj",
                kind: 'file',
                fileType: "code",
                data: {
                    title: "Automated Background Display System (BDS)",
                    role: "Embedded Systems Engineer",
                    year: "2024-2025",
                    stack: ["ESP32", "C++", "Stepper Motors"],
                    blurb: "A distributed embedded system designed for theatrical stage automation. Utilizes ESP32 microcontrollers to synchronize the rotation of high-torque triangular prism units, allowing for seamless transition between three distinct background sets.",
                    notes: "Developed custom control protocols for precise panel positioning and synchronized multi-unit rotation for the Odyssey of the Mind competition.",
                    tags: ["C++", "Embedded Systems", "Automation"],
                    link: "https://github.com/RibaDiba/Background-Display-System-Arduino",
                    previewImage: localPreview("/ProjectImages/BDS_Cover.png", "BDS Preview"),
                    mediaAssets: [
                        externalMedia("https://youtu.be/J0w5FN1HMhc", "video", "BDS Demo"),
                        externalMedia("/ProjectImages/BDS_Sketch.jpg", "image", "Sketch of BDS")
                    ]
                }
            }, 
            {
                id: "Expandable Shield",
                label: "Shield.proj",
                kind: 'file',
                fileType: "code",
                data: {
                    title: "Servo-Actuated Kinetic Shield",
                    role: "Mechanical & Systems Designer",
                    year: "2024-2025",
                    stack: ["ESP32", "C++", "Servo Control"],
                    blurb: "A mechanical prop featuring a servo-driven expansion mechanism. Built with laser-cut wood and high-tension string rigging, controlled by an ESP32 to provide button-activated, high-speed deployment.",
                    notes: "Focused on mechanical leverage optimization and integrated embedded triggers for high-performance use.",
                    tags: ["C++", "Embedded Systems", "Mechatronics"],
                    link: "",
                    previewImage: localPreview("/ProjectImages/Shield_Cover.png", "Shield Sketch"),
                    mediaAssets: [
                        externalMedia("https://youtu.be/pXhrgKOtZv8", "video", "Shield Demo"),
                    ]
                }
            }
        ]
    },
    {
        id: "UI/UX",
        label: "UI/UX",
        kind: "folder",
        children: [
            {
                id: "Leastudo",
                label: "Lease.proj",
                kind: "file",
                fileType: "code",
                data: {
                    title: "Leastudo",
                    role: "Frontend Architect",
                    year: "2025",
                    stack: ["Next.js", "Node", "MongoDB", "Tailwind"],
                    blurb: "A full-stack subleasing marketplace optimized for the UMD student ecosystem. Features a responsive Next.js frontend integrated with a Node.js/MongoDB backend to streamline off-campus housing discovery and peer-to-peer lease transfers.",
                    notes: "Spearheaded the UI/UX design system in Figma and implemented the frontend architecture using modern React patterns.",
                    tags: ["Figma", "Next.js", "Product Design"],
                    link: "Almost Done!",
                    previewImage: localPreview("/ProjectImages/Leastudo_Mockup.png", "Leastudo project preview"),
                    mediaAssets: []
                }
            },
            {
                id: "Recall",
                label: "Recall.proj",
                kind: "file",
                fileType: "code",
                data: {
                    title: "Recall",
                    role: "Full Stack Engineer",
                    year: "2026",
                    stack: ["Swift", "ArcFace", "Ollama", "CoreML"],
                    blurb: "An iOS-native cognitive aid for dementia patients utilizing on-device computer vision. Implements a zero-shot facial recognition framework (ArcFace) and local LLM (Ollama) to identify and provide context for loved ones and caretakers without requiring cloud processing.",
                    notes: "Awarded Winner at Bitcamp 2026 among 220+ projects. Engineered the on-device inference pipeline and user-centric interface.",
                    tags: ["Computer Vision", "iOS Development", "Edge AI"],
                    link: "https://github.com/akhilapnuri/RecallMobileApp",
                    previewImage: localPreview("/ProjectImages/Recall_Image.png", "Recall Mockup Preview"),
                    mediaAssets: []
                }
            },
            {
                id: "SavRe",
                label: "SaveRe.proj",
                kind: "file",
                fileType: "code",
                data: {
                    title: "SavRe",
                    role: "Full Stack Developer",
                    year: "2025",
                    stack: ["Next.js", "FastAPI", "Tesseract OCR", "Gemini API"],
                    blurb: "An AI-powered inventory and nutrition management system. Leverages OCR for automated grocery receipt parsing and integrates the Gemini API to generate dynamic recipes based on real-time pantry data and expiration tracking.",
                    notes: "Developed for HackPrinceton Fall 2025, focusing on data extraction accuracy and generative AI integration.",
                    tags: ["NLP", "Generative AI", "FastAPI"],
                    link: "https://github.com/RibaDiba/SaveRe",
                    previewImage: localPreview("/ProjectImages/SaveRe_Mockup.png", "SavRe Mockup"),
                    mediaAssets: []
                }
            },
            {
                id: "Personal Website",
                label: "PWeb.proj",
                kind: "file",
                fileType: "code",
                data: {
                    title: "Retro Desktop Portfolio",
                    role: "Motion & Web Engineer",
                    year: "2024",
                    stack: ["Next.js", "Framer Motion", "TypeScript"],
                    blurb: "A retro-inspired interactive desktop environment built with Next.js and Framer Motion. Features a multi-window manager, custom physics-based interactions, and a declarative store-driven architecture.",
                    notes: "Iteration v3 focusing on advanced motion design and nostalgic computing aesthetics.",
                    tags: ["Web", "Motion Design", "UX Architecture"],
                    link: "ribadiba.github.io",
                    previewImage: localPreview("/ProjectImages/Website_Mockup.png"),
                    mediaAssets: []
                }
            }
        ]
    },
    {
        id: "research",
        label: "research",
        kind: "folder",
        children: [
            {
                id: "princeton",
                label: "tumor_segmentation.paper",
                kind: "file",
                fileType: "paper",
                data: {
                    title: "Tumor Multimodal Segmentation",
                    role: "Undergraduate Researcher",
                    year: "2024—Present",
                    stack: ["Python", "PyTorch", "Detectron2", "OpenCV"],
                    blurb: "Researching multimodal deep learning architectures for preclinical tumor analysis. Developed a custom input pipeline that incorporates depth-map telemetry into color-space channels to enhance segmentation precision in complex biological environments.",
                    notes: "Currently preparing findings for publication; focusing on feature fusion techniques for medical imaging.",
                    tags: ["Deep Learning", "Medical Imaging", "Computer Vision"],
                    link: "",
                    mediaAssets: []
                }
            },
        ]
    },
    {
        id: "SWE",
        label: "SWE",
        kind: "folder",
        children: [
            {
                id: "Mitsubishi",
                label: "Mitsubishi.proj",
                kind: "file",
                fileType: "code",
                data: {
                    title: "Mitsubishi Electric NDA Platform",
                    role: "Full Stack Engineer",
                    year: "2026—Present",
                    stack: ["Next.js", "FastAPI", "AWS Bedrock", "SharePoint"],
                    blurb: "An enterprise NDA lifecycle management platform developed for Mitsubishi Electric US. Features an RAG assistant powered by AWS Bedrock for SharePoint document querying and a streamlined automated drafting system for legal agreements.",
                    notes: "Led the frontend development and integrated AWS Bedrock for intelligent document assistance in collaboration with MEUS.",
                    tags: ["Enterprise SWE", "LLM", "AWS"],
                    link: "",
                    previewImage: localPreview("/ProjectImages/MEUS.png", "Mindshift project preview"),
                    mediaAssets: []
                }
            },
            {
                id: "Leastudo",
                label: "Lease.proj",
                kind: "file",
                fileType: "code",
                data: {
                    title: "Leastudo",
                    role: "Frontend Architect",
                    year: "2025",
                    stack: ["Next.js", "Node", "MongoDB", "Tailwind"],
                    blurb: "A full-stack subleasing marketplace optimized for the UMD student ecosystem. Features a responsive Next.js frontend integrated with a Node.js/MongoDB backend to streamline off-campus housing discovery and peer-to-peer lease transfers.",
                    notes: "Spearheaded the UI/UX design system in Figma and implemented the frontend architecture using modern React patterns.",
                    tags: ["Figma", "Next.js", "Product Design"],
                    link: "Almost Done!",
                    previewImage: localPreview("/ProjectImages/Leastudo_Mockup.png", "Leastudo project preview"),
                    mediaAssets: []
                }
            },
        ]
    },
    {
        id: "play",
        label: "play",
        kind: "folder",
        children: [
            {
                id: "snake",
                label: "snake.exe",
                kind: "file",
                fileType: "game",
                data: {
                    title: "Snake: Legacy Edition",
                    role: "Technical Toy",
                    year: "2026",
                    stack: ["React", "Canvas API"],
                    blurb: "The classic arcade game rebuilt for the retro desktop. Navigate the grid and consume data packets without colliding with the system boundaries.",
                    notes: "Use arrow keys or WASD to control.",
                    tags: ["Minigame", "Classic"],
                    link: "Play Now",
                    mediaAssets: []
                }
            }
        ]
    },
    {
        id: "about",
        label: "readme.txt",
        kind: "file",
        fileType: "paper",
        data: {
            title: "readme.txt",
            role: "System Overview",
            year: "2026",
            stack: ["OS Architecture"],
            blurb: "Welcome to the interactive portfolio environment. Folders represent domain categories; files represent specific engineering projects. Utilize standard window management paradigms: drag title-bars to relocate, click to focus.",
            notes: "Non-destructive environment. All windows are virtualized and responsive.",
            tags: ["System Info"],
            link: "",
            previewImage: localPreview("/PFP.png", "Retro desktop overview"),
            mediaAssets: []
        }
    }
];
