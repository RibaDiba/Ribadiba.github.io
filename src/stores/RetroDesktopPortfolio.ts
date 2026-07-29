import { getAssetPath } from "@/utils/paths";
import Leastudo from "@/components/DesignPages/Leastudo";
import SaveRe from "@/components/DesignPages/SaveRe";
import Recall from "@/components/DesignPages/Recall";
import Sol from "@/components/DesignPages/Sol";
import {
    portfolioFileTypes,
    portfolioMediaTypes,
    type DesignCardProps,
    type DesignLanguageCard,
    type DesignRoleCard,
    type PortfolioDesktopNode,
    type PortfolioDesignFileNode,
    type PortfolioFileData,
    type PortfolioFileNode,
    type PortfolioFileType,
    type PortfolioFolderNode,
    type PortfolioMediaAsset,
    type PortfolioMediaSource,
    type PortfolioMediaType,
    type PortfolioPreviewImage,
    type PortfolioStandardFileNode,
} from "@/interfaces/portfolio";

export {
    portfolioFileTypes,
    portfolioMediaTypes,
    type DesignCardProps,
    type DesignLanguageCard,
    type DesignRoleCard,
    type PortfolioDesktopNode,
    type PortfolioDesignFileNode,
    type PortfolioFileData,
    type PortfolioFileNode,
    type PortfolioFileType,
    type PortfolioFolderNode,
    type PortfolioMediaAsset,
    type PortfolioMediaSource,
    type PortfolioMediaType,
    type PortfolioPreviewImage,
    type PortfolioStandardFileNode,
} from "@/interfaces/portfolio";

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
                id: "sol-design",
                label: "Sol.des",
                kind: "file",
                fileType: "design",
                component: Sol,
                defaultSize: { width: 700, height: 736 },
                roleCard: {
                    role: "Just Building",
                    year: "???",
                    stack: "Next.js \u00b7 WebGL \u00b7 TS",
                    tags: ["Scheduling", "Open-Source", "UMD"],
                    linkText: "github.com/SolUMD \u2192",
                    linkHref: "https://github.com/SolUMD",
                    figmaLinkText: "figma.com/design/SOC_Prototype \u2192",
                    figmaLinkHref: "https://www.figma.com/design/ipceTF0FZ2LBMYvoEQAYoi/SOC_Prototype?node-id=0-1&t=ojcYkzRMEPdOmOT4-1",
                },
                designLanguageCard: {
                    swatches: ["var(--gold)", "var(--coral)", "var(--espresso)", "var(--teal)"],
                    description: "Sunset gold into coral over warm cream, Clash Display against wonky Fraunces italics. Insipred by a golden hour sunset to make a spreadsheet seem friendly.",
                },
            },
            {
                id: "leastudo-design",
                label: "Lease.des",
                kind: "file",
                fileType: "design",
                component: Leastudo,
                defaultSize: { width: 700, height: 736 },
                roleCard: {
                    role: "Designer & Engineer",
                    year: "2026\u2014",
                    stack: "Next.js \u00b7 MongoDB \u00b7 AWS S3",
                    tags: ["Figma", "mobile", "housing"],
                },
                designLanguageCard: {
                    swatches: ["#7A1B1B", "#E7B6B6", "#4A5565"],
                    description: "Maroon & rose on warm cream, UMD's colors with a modern feel. Bright red colors, a reflection of Zillow's design.",
                },
            },
            {
                id: "recall-design",
                label: "Recall.des",
                kind: "file",
                fileType: "design",
                component: Recall,
                defaultSize: { width: 700, height: 616 },
                roleCard: {
                    role: "Designer & Engineer",
                    year: "Bitcamp 2026",
                    stack: "SwiftUI \u00b7 CoreML \u00b7 Ollama",
                    tags: ["On Device AI", "Mobile", "Design"],
                    linkText: "github.com/akhilapnuri/RecallMobileApp \u2192",
                    linkHref: "https://github.com/akhilapnuri/RecallMobileApp",
                    figmaLinkText: "figma.com/design/Safe-Heaven \u2192",
                    figmaLinkHref: "https://www.figma.com/design/ZIVuVXyWln04tcfPhR5GzB/Safe-Heaven?node-id=0-1&t=WtDbr2HlOVulODym-1",
                },
                designLanguageCard: {
                    swatches: ["#21622D", "#FAF6ED", "#435D47"],
                    description: "Forest green & warm cream, meant to be a hyper focused, simple UI. Large buttons, few options are on purpose.",
                },
            },
            {
                id: "savre-design",
                label: "SavRe.des",
                kind: "file",
                fileType: "design",
                component: SaveRe,
                defaultSize: { width: 700, height: 716 },
                roleCard: {
                    role: "Full-Stack Developer",
                    year: "F25 Hack Princeton",
                    stack: "Next.js \u00b7 FastAPI \u00b7 Gemini API",
                    tags: ["Hackathon", "OCR", "Design"],
                    linkText: "github.com/RibaDiba/SaveRe \u2192",
                    linkHref: "https://github.com/RibaDiba/SaveRe",
                    figmaLinkText: "figma.com/design/HackPrinceton \u2192",
                    figmaLinkHref: "https://www.figma.com/design/KbU0hNPS9ubXBmH9fZTp2y/HackPrinceton?node-id=0-1&t=1mKre8QtqUilH0Up-1",
                },
                designLanguageCard: {
                    swatches: ["#354A33", "#95C590", "#FAF6ED"],
                    description: "Forest green on cream, pill buttons, made to feel green with a sense of calm. Minmal UI to keep things organized",
                },
            },
        ],
    },
    {
        id: "research",
        label: "research",
        kind: "folder",
        children: [
            {
                id: "Princeton",
                label: "tumor.paper",
                kind: "file",   
                fileType: "paper",
                data: {
                    title: "Tumor Multimodal Segmentation",
                    role: "Undergraduate Researcher",
                    year: "2024—Present",
                    stack: ["Python", "PyTorch", "Detectron2", "OpenCV"],
                    blurb: "Researching multimodal deep learning architectures for preclinical tumor analysis. Developed a custom input pipeline that incorporates depth-map telemetry into color-space channels to enhance segmentation precision in complex biological environments.",
                    notes: "Advised by Prof. Puchalla.",
                    tags: ["Deep Learning", "Medical Imaging", "Computer Vision"],
                    link: "https://github.com/RibaDiba/tumor-segmentation",
                    mediaAssets: []
                }
            },
            {
                id: "Maryland",
                label: "sensaug.paper",
                kind: "file",
                fileType: "paper",
                data: {
                    title: "Sensitivity Anaylsis with PCA",
                    role: "Undergraduate Researcher",
                    year: "2026-Present", 
                    stack: ["Python", "PyTorch", "MMEngine", "OpenCV"],
                    blurb: "Researching incoperating principal component analysis via gradient decent of differentiable augmentations to improve model preformance.",
                    notes: "Advised by Prof. Lin, Dr. Laura Zheng.",
                    tags: ["Deep Learning", "Medical Imaging", "Computer Vision"],
                    link: "https://github.com/RibaDiba/tumor-segmentation",
                    mediaAssets: []
                }
            }
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
    }
];
