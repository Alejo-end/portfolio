import { Project } from "@/app/types"
import { midihostFirmware } from "./code/midihost"

export const projects: Project[] = [
  {
    title: "Mangler",
    description:
      "A live stereo sampler and mangler for norns. (norns is a small open sound computer from monome.) It is for anyone who wants to record live gear and warp it on the fly: plug in a synth, a drum machine, or anything else that runs at line level, record a phrase, and it loops straight back the way you played it. From there you can granulate it, time-stretch it, chop it into playable slices, and run it through a filter, delay and reverb.",
    technologies: ["Lua", "SuperCollider", "norns", "softcut", "MIDI"],
    alias: "mangler",
    githubUrl: "https://github.com/Alejo-end/mangler",
    year: 2026,
  },
  {
    title: "snu",
    description:
      "A multi-track 8-step sequencer for monome norns and an 8x8 grid. Four tracks run in parallel, each sequencing either notes from a scale or MIDI CC values, with per-step velocity, note length, mute and skip, per-track octave, pattern chaining, live grid editing, and an animated screen UI. The UI snapshots here are rendered straight from the real script by a headless simulator I built for the docs.",
    technologies: ["Lua", "norns", "monome grid", "MIDI", "PolyPerc"],
    alias: "snu",
    githubUrl: "https://github.com/absurd-turtle/snu",
    year: 2026,
  },
  {
    title: "MIDI Guitar",
    description:
      "My final project for the Aalto Fab Lab (Digital Fabrication) course — a MIDI controller built into a Squier Mustang guitar. A Seeed XIAO ESP32-S3 reads a VL53L1X time-of-flight sensor, turning hand movements above the body into MIDI CC and pitch-bend messages, with an OLED menu, a NeoPixel ring, and a rotary encoder for live tweaking. It transmits wirelessly over ESP-NOW to a custom receiver PCB I designed in KiCad and milled on a Roland SRM-20, which forwards MIDI to Max/MSP and Ableton.",
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
      "A PCB designed in KiCad during the Aalto Fab Lab electronics design week that bridges two USB MIDI hosts that can't talk to each other directly — like a laptop running Max and a norns. Two Seeed XIAO RP2040s share one board, joined over UART with crossed TX/RX lines, shared power, and decoupling capacitors close to their power pins. I milled the board on a Roland SRM-20, soldered the SMD resistors and pin headers, and designed a 3D-printed case in FreeCAD via KiCad StepUp. The TinyUSB firmware runs on both XIAOs and forwards MIDI between USB and hardware serial — bridging my norns running snu straight into Ableton, with the onboard RGB LED flashing as messages pass through.",
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
      "I have been learning more about analog photography in 35mm and this is what my camera have taken. using a Chinon CE-4 camera and a 50mm f2.0 Pentax lens.",
    technologies: ["Photography"],
    alias: "film",
    year: 2025,
  },
  {
    title: "Sounds of the Weather Turning",
    description:
      "A max4live audio effect that uses weather data (from the WAQI API) to adjust different effects like delay, reverb, echo and distortion. It uses the newly available ABL objects which are an extension of ableton effects and DSP components for MaxMSP. The patch is available for free download on the max4live website.",
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
      "I started in the world of analog photography by building my own 3D printed pinhole camera. I have been experimenting with different pinhole diameters and random developing techniques to create unique images.",
    technologies: ["3D Printing", "Photography", "Pinhole"],
    alias: "photo",
    year: 2024,
  },
  {
    title: "Norns Studies",
    description:
      "I have been exploring hardware and decided to put together a Norns shield, which is an open source hardware using Lua and Supercollider.",
    technologies: ["Lua", "SuperCollider", "Norns"],
    alias: "norns",
    githubUrl: "",
    year: 2024,
  },
  {
    title: "MaxMSP Studies",
    description:
      "MaxMSP is a visual programming language used for sound and visual experimentation. I use it along with RNBO and React for various experiments.",
    technologies: [
      "React",
      "TypeScript",
      "RNBO",
      "Next.js",
      "MaxMSP",
      "Jitter",
    ],
    githubUrl: "https://github.com/yourusername/rnbo-studies",
    alias: "max",
    year: 2024,
  },
  {
    title: "3D & Photogrammetry",
    description:
      "I enjoy 3D modeling, scanning, and printing. Three.js is an amazing tool to build 3D websites and animations.",
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
      "I use MaxMSP, Norns, and SuperCollider to create generative music patterns. I also integrate them with Ableton Live for a seamless workflow.",
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
      "Live coding is a way to create music and visuals in real time. I'm part of a community called AlgoRave where we improvise with code.",
    alias: "livecoding",
    technologies: ["Hydra", "P5.js", "Strudel", "MaxMSP", "SuperCollider"],
    year: 2023,
  },
  {
    title: "EcoBridge",
    description:
      "An open data project focused on public finances. This project won 1st place at an open data hackathon.",
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

