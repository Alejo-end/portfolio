import { Project } from "@/app/types"
import { midihostFirmware } from "./code/midihost"

export const projects: Project[] = [
  {
    title: "Mangler",
    description:
      "A live stereo sampler for norns, monome's small sound computer. Plug in a synth, a drum machine, or anything else at line level, record a phrase, and it loops straight back the way you played it. From there you can granulate it, time-stretch it, chop it into playable slices, and run it through a filter, delay and reverb. It also captures whole sounds as scenes and morphs between them: the orbit page drifts through your saved scenes on its own, and the erosion page wears the loop down a little more on every pass. The screen images here are rendered from the real script by a headless simulator.",
    technologies: ["Lua", "SuperCollider", "norns", "softcut", "MIDI"],
    alias: "mangler",
    githubUrl: "https://github.com/Alejo-end/mangler",
    year: 2026,
  },
  {
    title: "snu",
    description:
      "An 8-step sequencer for monome norns and an 8x8 grid. Four tracks run in parallel, each playing notes from a scale or sending MIDI CC, with per-step velocity, note length, mute and skip, pattern chaining, and live editing on the grid. The UI snapshots here are rendered straight from the real script by a headless simulator I built for the docs.",
    technologies: ["Lua", "norns", "monome grid", "MIDI", "PolyPerc"],
    alias: "snu",
    githubUrl: "https://github.com/absurd-turtle/snu",
    year: 2026,
  },
  {
    title: "MIDI Guitar",
    description:
      "My final project for the Aalto Fab Lab course: a MIDI controller built into a Squier Mustang guitar. A XIAO ESP32-S3 reads a time-of-flight sensor, so hand movements above the body become MIDI CC and pitch bend, with an OLED menu, a NeoPixel ring, and an encoder for tweaking settings mid-song. Everything transmits wirelessly over ESP-NOW to a receiver PCB I designed in KiCad and milled on a Roland SRM-20, which passes the MIDI on to Max/MSP and Ableton.",
    technologies: [
      "XIAO ESP32-S3",
      "C++",
      "KiCad",
      "VL53L1X ToF",
      "ESP-NOW",
      "MIDI",
      "Max/MSP",
    ],
    alias: "midiguitar",
    githubUrl: "https://github.com/Alejo-end/midiguitar",
    liveUrl:
      "https://digital-fabrication-1baba0.gitlab.io/assignments/final-project.html",
    year: 2026,
  },
  {
    title: "MIDI Host-to-Host Bridge",
    description:
      "A small PCB that lets two USB MIDI hosts talk to each other — like a laptop and a norns, which both expect to be the one in charge. Two XIAO RP2040s share the board, joined over UART with crossed TX/RX lines, and each runs TinyUSB firmware that forwards MIDI between its USB port and the serial link. I designed it in KiCad during the Fab Lab electronics week, milled it on a Roland SRM-20, soldered it up, and printed a case modeled in FreeCAD. It now bridges my norns straight into Ableton, RGB LED flashing as the notes pass through.",
    technologies: ["KiCad", "XIAO RP2040", "UART", "MIDI", "PCB Design", "Roland SRM-20", "TinyUSB"],
    codeSnippets: [
      { filename: "MIDIHost2Host.ino", language: "cpp", code: midihostFirmware },
    ],
    alias: "midihost",
    githubUrl:
      "https://digital-fabrication-1baba0.gitlab.io/media/files/Midi2host.zip",
    liveUrl:
      "https://digital-fabrication-1baba0.gitlab.io/assignments/07_electronics-design.html",
    year: 2026,
  },
  {
    title: "Analog Photography",
    description:
      "Photos from my ongoing attempt to learn 35mm film photography, shot on a Chinon CE-4 with a 50mm f/2 Pentax lens.",
    technologies: ["Photography"],
    alias: "film",
    year: 2025,
  },
  {
    title: "Sounds of the Weather Turning",
    description:
      "A Max for Live audio effect that turns live weather data into sound processing. Air quality readings from the WAQI API steer delay, reverb, echo and distortion, built on the ABL objects that expose Ableton's own effects inside Max. The device is a free download on maxforlive.com.",
    technologies: ["MaxMSP", "Ableton Live", "WAQI API", "Max4Live"],
    alias: "weather",
    githubUrl:
      "https://maxforlive.com/library/device/14101/sounds-of-the-weather-turning",
    liveUrl: "https://youtu.be/wVJ3n1L9Egk",
    year: 2025,
  },
  {
    title: "3D Printed Pinhole Photography",
    description:
      "My way into analog photography: a pinhole camera I 3D printed myself, then kept tweaking — different pinhole diameters, different films, and some fairly improvised developing.",
    technologies: ["3D Printing", "Photography", "Pinhole"],
    alias: "photo",
    year: 2024,
  },
  {
    title: "Norns Studies",
    description:
      "I soldered together a norns shield, the DIY build of monome's open sound computer, and have been learning my way around Lua and SuperCollider scripting on it since.",
    technologies: ["Lua", "SuperCollider", "Norns"],
    alias: "norns",
    githubUrl: "",
    year: 2024,
  },
  {
    title: "MaxMSP Studies",
    description:
      "Sketches and experiments in MaxMSP, a visual programming language for sound and image. Some stay patches; some get exported with RNBO and wired into React apps so they run in the browser.",
    technologies: [
      "React",
      "TypeScript",
      "RNBO",
      "Next.js",
      "MaxMSP",
      "Jitter",
    ],
    alias: "max",
    year: 2024,
  },
  {
    title: "3D & Photogrammetry",
    description:
      "3D scans, models and prints. I photograph objects, rebuild them with photogrammetry tools like RealityScan, clean them up in Blender, and sometimes put the results on the web with Three.js.",
    technologies: [
      "RealityScan",
      "Three.js",
      "React",
      "RealityCapture",
      "Blender",
      "Thinkercad",
    ],
    alias: "3dscanning",
    year: 2024,
  },
  {
    title: "Music Experiments",
    description:
      "Generative music sketches made with MaxMSP, norns and SuperCollider, usually routed into Ableton Live so an experiment can turn into an actual track.",
    technologies: [
      "MaxMSP",
      "SuperCollider",
      "Strudel.js",
      "Ableton Live",
      "Norns",
    ],
    alias: "music",
    year: 2024,
  },
  {
    title: "Live Coding",
    description:
      "Making music and visuals by writing code in real time, in front of people. I play at algorave events, improvising with Hydra, Strudel and SuperCollider.",
    alias: "livecoding",
    technologies: ["Hydra", "P5.js", "Strudel", "MaxMSP", "SuperCollider"],
    year: 2023,
  },
  {
    title: "EcoBridge",
    description:
      "An open data project about public finances, built with a React front end and a Node and MongoDB back end. It won first place at an open data hackathon.",
    technologies: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
    alias: "ecobridge",
    githubUrl: "https://github.com/EcoBridge-Team/ecosystem",
    liveUrl: "https://www.youtube.com/watch?v=eDPPhKLgn-o",
    year: 2020,
  },
];

export function getProjectByAlias(alias: string): Project | undefined {
    return projects.find(project => project.alias === alias)
}

