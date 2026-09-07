import { Project } from "@/app/types"
import { midihostFirmware } from "./code/midihost"

export const projects: Project[] = [
  {
    title: "Mangler",
    description:
      "Live stereo sampler for norns. Record a phrase and mangle it: granular, time-stretch, slices, filter, delay, reverb. Scenes capture whole sounds, orbit drifts between them, erosion wears the loop down on every pass.",
    technologies: ["Lua", "SuperCollider", "norns", "softcut", "MIDI"],
    alias: "mangler",
    githubUrl: "https://github.com/Alejo-end/mangler",
    year: 2026,
    galleryLayout: "grid",
  },
  {
    title: "snu",
    description:
      "8-step sequencer for norns and grid. Four tracks, notes or CC, per-step velocity, length, mute and skip, pattern chaining, live editing. The UI shots are rendered from the real script by a headless simulator I built.",
    technologies: ["Lua", "norns", "monome grid", "MIDI", "PolyPerc"],
    alias: "snu",
    githubUrl: "https://github.com/absurd-turtle/snu",
    year: 2026,
    galleryLayout: "grid",
  },
  {
    title: "MIDI Guitar",
    description:
      "A Squier Mustang turned MIDI controller. A time-of-flight sensor tracks hand movement above the body for CC and pitch bend, sent wirelessly over ESP-NOW to a receiver PCB I designed and milled myself. Final project for the Aalto Fab Lab course.",
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
      "A small PCB that lets two USB MIDI hosts talk, like a laptop and a norns. Two RP2040s bridged over UART, TinyUSB firmware forwarding MIDI both ways. Designed in KiCad, milled, soldered, printed a case. It now runs my norns into Ableton.",
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
      "Learning 35mm film on a Chinon CE-4 with a 50mm f/2 Pentax lens.",
    technologies: ["Photography"],
    alias: "film",
    year: 2025,
  },
  {
    title: "Sounds of the Weather Turning",
    description:
      "A Max for Live effect driven by the weather. Live air quality data steers delay, reverb, echo and distortion. Free on maxforlive.com.",
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
      "A 3D printed pinhole camera. Different pinhole diameters, different films, improvised developing.",
    technologies: ["3D Printing", "Photography", "Pinhole"],
    alias: "photo",
    year: 2024,
  },
  {
    title: "Norns Studies",
    description:
      "I soldered together a norns shield and have been scripting it in Lua and SuperCollider since.",
    technologies: ["Lua", "SuperCollider", "Norns"],
    alias: "norns",
    year: 2024,
  },
  {
    title: "MaxMSP Studies",
    description:
      "Sketches in MaxMSP. Some stay patches, some get exported with RNBO and run in the browser.",
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
      "3D scans, models and prints. Photogrammetry in RealityScan, cleanup in Blender, some end up on the web in Three.js.",
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
      "Generative sketches with MaxMSP, norns and SuperCollider, routed into Ableton when one turns into a track.",
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
      "Music and visuals coded live at algoraves, improvised with Hydra, Strudel and SuperCollider.",
    alias: "livecoding",
    technologies: ["Hydra", "P5.js", "Strudel", "MaxMSP", "SuperCollider"],
    year: 2023,
  },
  {
    title: "EcoBridge",
    description:
      "An open data project on public finances. React, Node, MongoDB. Global finalist at IBM's Call for Code 2021.",
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

