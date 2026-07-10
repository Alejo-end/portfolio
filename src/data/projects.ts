import { Project } from "@/app/types"

export const projects: Project[] = [
  {
    title: "Mangler",
    description:
      "A live stereo sampler and mangler for norns, the small open-source sound computer from monome. Plug in a synth or drum machine, record a phrase, and it loops straight back the way you played it — then granulate it, time-stretch it, chop it into playable slices, and run it through filter, delay and reverb. The whole instrument is driven with three keys and three encoders (no grid required), and the sample retunes chromatically over MIDI. Under the hood, softcut handles the tape path while SuperCollider does the granular, stretch and custom FX, and every parameter is mappable to keys, MIDI and an optional grid.",
    technologies: [
      "Lua",
      "SuperCollider",
      "norns",
      "softcut",
      "MIDI",
    ],
    alias: "mangler",
    githubUrl: "https://github.com/Alejo-end/mangler",
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

