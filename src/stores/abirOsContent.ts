// Shared content for the abir_os experience (desktop + mobile)

export const claudeBioStream = {
    question: "who is abir modak",
    toolCall: { tool: "Read", arg: "about/abir.md", lines: 24 },
    paragraphs: [
        "<b>Abir Modak</b> is a CS student at the University of Maryland, College Park (Class of 2028). He works as a software engineer at <b>App Dev Club</b> with <b>Mitsubishi Electric</b> building an AI-powered NDA generation and management platform, and he does research at <b>Princeton</b> on tumor segmentation with Detectron2 and multimodal imaging.",
        "Outside of that, he's an avid <b>Nintendo</b> fan, watches anime, and follows cricket."
    ]
} as const;

export const niceTryJokes = [
    "but there's no API call here — this is a static page, not a real terminal.",
    "but there's no API call. you typed into a <span class=\"path\">setTimeout</span> that's pretending to think.",
    "but there's no API call wired up. just HTML, CSS, and one very enthusiastic <span class=\"path\">useEffect</span>.",
    "but there's no API call. 0 tokens spent, 0 tokens billed — it's static all the way down.",
    "but there's no API call. the only thing on the other end of this prompt is the DOM.",
    "but there's no API call behind this. it's a portfolio in a trench coat pretending to be Claude.",
    "but there's no API call. i'm a screenshot of intelligence, not the real thing.",
    "but there's no API call here. the backend is one developer's <span class=\"path\">localStorage</span> and good vibes."
] as const;

// Hand-tuned readme that references the repo's actual folders.
export const readmeMarkup =
`     
  hi, i'm <b>abir modak</b> — cs @ umd,
  class of 2028.
  this is my desktop. poke around:

   <span class="hl">Hardware/</span>  things i've built irl
   <span class="hl">UI/UX/</span>     things i've designed
   <span class="hl">research/</span>  things i'm researching
   <span class="hl">SWE/</span>       things i've shipped
   <span class="hl">play/</span>      minigames 

  — abir`;
