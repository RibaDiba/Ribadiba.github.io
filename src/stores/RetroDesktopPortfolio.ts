import { getAssetPath } from "@/utils/paths";

export const portfolioFileTypes = ["img", "code", "paper"] as const;
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
                    title: "Raspberry PI Electric Car",
                    role: "Developer",
                    year: "2024-2025",
                    stack: ["Raspberry PI", "ESP32", "C++"],
                    blurb: "Ridebale PI electric car powered by two 12V Car batteries with omni directional wheels controlled by a Nintendo Joycon Controller",
                    notes: "Helped with assembly, programming, and testing. Made for the Odessey of the Mind competition.",
                    tags: ["Pi", "C++", "Embeded Systems"],
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
                    title: "Background Display System",
                    role: "Developer",
                    year: "2024-2025",
                    stack: ["ESP32", "C++"],
                    blurb: "Built a background display system to effecivly swap and showcase backgrounds for a play. Created trangular prisims to store 3 backgrounds per unit.",
                    notes: "Helped with assembly, programming, and testing. Made for the Odessey of the Mind competition.",
                    tags: ["C++", "Embeded Systems"],
                    link: "https://github.com/RibaDiba/Background-Display-System-Arduino",
                    previewImage: localPreview("/ProjectImages/Pi_Mockup.png", "Car Cad Design"),
                    mediaAssets: [
                        externalMedia("https://youtu.be/HSFzfCUV7-w", "video", "Electric car demo")
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
                label: "Leastudo.proj",
                kind: "file",
                fileType: "img",
                data: {
                    title: "Leastudo",
                    role: "Frontend Engineer",
                    year: "2025",
                    stack: ["Next.js", "Node", "MongoDB"],
                    blurb: "A subleasing platform for UMD students, built to help students find housing off campus and connect with students who want to sublet their apartment.",
                    notes: "Helped with UI/UX design and implmented the frontend ",
                    tags: ["Figma", "Next.js", "Product"],
                    link: "Almost Done!",
                    previewImage: localPreview("/ProjectImages/Leastudo_Mockup.png", "Leastudo project preview"),
                    mediaAssets: []
                }
            },
            {
                id: "Mitsubishi",
                label: "Mitsubishi.proj",
                kind: "file",
                fileType: "img",
                data: {
                    title: "Mitsubishi Electric",
                    role: "Full Stack Engineer",
                    year: "2026—Present",
                    stack: ["Next.js", "FastAPI", "Shadcn"],
                    blurb: "Building a tool to optmize, organize, and sustain NDA generation and management for Mitsubishi Electric.Includes features such as an AI helper served through AWS bedrock that interacts with the sharepoint database and a streamlined process for filling out confedntial NDAs. Part of a project between App Dev Club and MEUS.",
                    notes: "Adapted Figma to changing project requirements, implmented frontend features, and created a streamlined process to fill out NDAs.",
                    tags: ["Next.js", "FastAPI", "Figma"],
                    link: "",
                    previewImage: localPreview("/Personal Website/assets/poster-sony.png", "Mindshift project preview"),
                    mediaAssets: []
                }
            },
            {
                id: "pennzoil",
                label: "Pennzoil.proj",
                kind: "file",
                fileType: "img",
                data: {
                    title: "Pennzoil Website",
                    role: "Web / Motion",
                    year: "2024",
                    stack: ["Webflow", "GSAP"],
                    blurb: "Rebuild of a product-lineup microsite. Heavier on motion than brief required — in a good way.",
                    notes: "Paced every scroll beat to the product hero; nothing moves unless it teaches you something.",
                    tags: ["web", "motion", "brand"],
                    link: "pennzoil.example →",
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
                    role: "Undergrad Researcher",
                    year: "2024—Present",
                    stack: ["Python", "PyTorch", "Detectron2"],
                    blurb: "Multimodal tumor segmentation, incoperating depth information into a color channel to improve segmentation on tumors in preclincal cancer trials.",
                    notes: "Currently putting together a paper.",
                    tags: ["Deep Learning", "Detectron2", "Image Segmentation"],
                    link: "",
                    mediaAssets: []
                }
            },
        ]
    },
    {
        id: "web",
        label: "web",
        kind: "folder",
        children: [
            {
                id: "site-v3",
                label: "site_v3.code",
                kind: "file",
                fileType: "code",
                data: {
                    title: "this site, v3",
                    role: "Design + Build",
                    year: "2026",
                    stack: ["HTML", "CSS", "a pinch of JS"],
                    blurb: "The thing you are on. Started as a wireframe, grew a desktop.",
                    notes: "Every section is its own aesthetic experiment. The retro desktop is the newest one.",
                    tags: ["personal", "web"],
                    link: "github.com/abirmodak/site",
                    previewImage: localPreview("/Personal Website/screenshots/desktop-current.png", "Site v3 desktop preview"),
                    mediaAssets: []
                }
            },
            {
                id: "tinytools",
                label: "tinytools.code",
                kind: "file",
                fileType: "code",
                data: {
                    title: "tiny tools",
                    role: "Maker",
                    year: "ongoing",
                    stack: ["Svelte", "Canvas", "SVG"],
                    blurb: "A loose collection of single-purpose web toys — a color picker that argues back, a font-pairing slot machine, etc.",
                    notes: "Designed as a graveyard for ideas too small to justify a proper project.",
                    tags: ["toys", "svelte"],
                    link: "tinytools.example",
                    mediaAssets: []
                }
            }
        ]
    },
    {
        id: "play",
        label: "play",
        kind: "folder",
        children: [
            {
                id: "posters",
                label: "posters.img",
                kind: "file",
                fileType: "img",
                data: {
                    title: "poster series",
                    role: "Designer",
                    year: "ongoing",
                    stack: ["Figma", "Risograph"],
                    blurb: "Late-night riso prints. A few are hanging in friends' apartments which is the only review that counts.",
                    notes: "Every one is an excuse to try a type pairing I would never ship to a client.",
                    tags: ["print", "type"],
                    link: "are.na/abir/posters",
                    mediaAssets: [
                        localMedia("/Personal Website/assets/poster-juststart.png", "image", "Just Start poster"),
                        localMedia("/Personal Website/assets/poster-sony.png", "image", "Sony DR-11 poster"),
                        localMedia("/Personal Website/assets/poster-whoareyou.png", "image", "Who Are You poster"),
                        localMedia("/Personal Website/assets/poster-god.png", "image", "Playstation Edge poster")
                    ]
                }
            },
            {
                id: "zines",
                label: "zines.img",
                kind: "file",
                fileType: "img",
                data: {
                    title: "zines",
                    role: "Writer / Editor",
                    year: "2023—",
                    stack: ["InDesign", "staple gun"],
                    blurb: "Occasional printed zines for the UMD design collective. 12–24 pages, 50 copies, gone in a week.",
                    notes: "The best deadline is the one a print shop imposes on you.",
                    tags: ["print", "writing"],
                    link: "issuu.com/abir",
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
            role: "—",
            year: "—",
            stack: ["about this desktop"],
            blurb: "Folders are categories. Files are projects. Drag window title-bars to move them. Click to focus; the focused window gets the orange title-bar.",
            notes: "Everything is clickable. Nothing is load-bearing.",
            tags: ["help"],
            link: "",
            previewImage: localPreview("/PFP.png", "Retro desktop overview"),
            mediaAssets: []
        }
    }
];
