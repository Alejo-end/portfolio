import { Project } from "@/app/types"

export const projects: Project[] = [
  {
    title: "Stray",
    description:
      "A spectral processor for a field recording, played from a MIDI keyboard. Play soft and the sound stays calm, play harder and it gets restless, then chaotic, moving around the room as it goes. Midterm for Programming in Max 1 at Sibelius Academy. The patch will be published soon.",
    technologies: ["Max 9", "MSP", "JavaScript", "MIDI", "nanoKONTROL2", "Dante", "Zoom H6", "Bitwig"],
    alias: "stray",
    kind: "sound",
    galleryLayout: "grid",
    specs: [
      { label: "speakers", value: "6.1 ring · stereo fallback" },
      { label: "room", value: "Sound Lab 1, Marsio, Aalto" },
      { label: "control", value: "MIDI keyboard · nanoKONTROL2" },
      { label: "recording", value: "Jaakko Arola, Hadi Hrekes, Wilson Tanner Smith (Something Else), Kallio" },
      { label: "recorder", value: "Zoom H6" },
      { label: "edit", value: "Bitwig: normalize, trim" },
    ],
    year: 2026,
  },
  {
    title: "Reins",
    description:
      "The MIDI Guitar as open hardware. A board on the guitar reads your hand. A pedal turns it into MIDI.",
    technologies: ["KiCad", "XIAO", "ToF", "MIDI", "PCB Design", "Open Hardware"],
    alias: "reins",
    kind: "hardware",
    specs: [
      { label: "guitar side", value: "ToF · LED ring · OLED · encoder · battery" },
      { label: "pedal", value: "MIDI DIN out · EXP · FOOT · OLED · LED bar" },
      { label: "link", value: "wireless" },
    ],
    videos: [
      { src: "/videos/reins-pedal.mp4", poster: "/videos/reins-pedal-poster.jpg", caption: "pedal" },
      { src: "/videos/reins-guitar.mp4", poster: "/videos/reins-guitar-poster.jpg", caption: "guitar side" },
    ],
    prototype: {
      title: "MIDI Guitar",
      alias: "midiguitar",
      year: 2026,
      description:
        "A Squier Mustang that sends MIDI. A distance sensor turns hand height into CC and pitch bend, sent wirelessly to a receiver board. Routed body, milled boards. Aalto Fab Lab final project.",
      specs: [
        { label: "sensor", value: "VL53L1X ToF" },
        { label: "mcu", value: "XIAO ESP32-S3" },
        { label: "link", value: "ESP-NOW" },
        { label: "output", value: "CC · pitch bend" },
      ],
      technologies: ["XIAO ESP32-S3", "C++", "KiCad", "VL53L1X ToF", "ESP-NOW", "MIDI", "Max/MSP"],
      githubUrl: "https://github.com/Alejo-end/midiguitar",
      liveUrl: "https://digital-fabrication-1baba0.gitlab.io/assignments/final-project.html",
    },
    year: 2026,
  },
  {
    title: "Mangler",
    description:
      "Live stereo sampler for norns. Granular, time-stretch, slices, filter, delay, reverb, and two layer decks that loop like a pedal. Scenes store whole sounds, orbit wanders between them, erosion wears the take down on each pass.",
    technologies: ["Lua", "SuperCollider", "norns", "softcut", "MIDI"],
    alias: "mangler",
    kind: "sound",
    githubUrl: "https://github.com/Alejo-end/mangler",
    year: 2026,
    galleryLayout: "grid",
  },
  {
    title: "snu",
    description:
      "8-step sequencer for norns and grid. Four tracks, notes or CC, per-step velocity, length, mute and skip, pattern chaining. Screenshots come from a headless simulator I wrote.",
    technologies: ["Lua", "norns", "monome grid", "MIDI", "PolyPerc"],
    alias: "snu",
    kind: "sound",
    githubUrl: "https://github.com/absurd-turtle/snu",
    year: 2026,
    galleryLayout: "grid",
  },
  {
    title: "2Host",
    description:
      "USB MIDI between two computers, both ways, no drivers. TRS MIDI in and out, type A or B. Every message passes, SysEx included. A panic button stops every note. First batch soon on Tori.",
    technologies: ["FreeCAD", "KiCad", "FR-4 PCB", "Hardwood", "XIAO RP2040", "TinyUSB", "Arduino", "MIDI", "JLCPCB"],
    alias: "2host",
    kind: "hardware",
    galleryLayout: "grid",
    specs: [
      { label: "ports", value: "2 × USB-C MIDI · TRS in · TRS out" },
      { label: "mcu", value: "2 × XIAO RP2040" },
      { label: "link", value: "UART, 1 Mbaud" },
      { label: "case", value: "hardwood tray, PCB lid · 62.4 × 47.3 × 10.4 mm" },
      { label: "alt case", value: "two PCB plates, M2 spacers · 65.7 × 44.9 × 9.9 mm" },
      { label: "board", value: "2 layers, assembled by JLCPCB" },
    ],
    prototype: {
      title: "MIDI Host-to-Host Bridge",
      alias: "midihost",
      year: 2026,
      description:
        "Rev 1. Two XIAOs linked by UART, milled on the Fab Lab's SRM-20, printed case. In daily use between my norns and Ableton.",
      specs: [
        { label: "mcu", value: "2 × XIAO RP2040" },
        { label: "link", value: "UART" },
        { label: "board", value: "milled on a Roland SRM-20" },
      ],
      technologies: ["KiCad", "XIAO RP2040", "UART", "MIDI", "Roland SRM-20", "TinyUSB"],
      githubUrl: "https://digital-fabrication-1baba0.gitlab.io/media/files/Midi2host.zip",
      liveUrl: "https://digital-fabrication-1baba0.gitlab.io/assignments/07_electronics-design.html",
    },
    year: 2026,
  },
  {
    title: "Analog Photography",
    description:
      "35mm on a Chinon CE-4 with a Pentax 50mm f/2.",
    technologies: ["35mm film", "Chinon CE-4"],
    alias: "film",
    kind: "image",
    year: 2025,
  },
  {
    title: "Sounds of the Weather Turning",
    description:
      "Max for Live effect. Live air quality data controls delay, reverb, echo and distortion. Free on maxforlive.com.",
    technologies: ["MaxMSP", "Ableton Live", "WAQI API", "Max4Live"],
    alias: "weather",
    kind: "sound",
    githubUrl:
      "https://maxforlive.com/library/device/14101/sounds-of-the-weather-turning",
    liveUrl: "https://youtu.be/wVJ3n1L9Egk",
    year: 2025,
  },
  {
    title: "3D Printed Pinhole Photography",
    description:
      "3D printed pinhole camera. Several pinhole sizes and films, developed at home.",
    technologies: ["3D Printing", "Photography", "Pinhole"],
    alias: "photo",
    kind: "image",
    year: 2024,
  },
  {
    title: "Norns Studies",
    description:
      "Soldered a norns shield. Scripts in Lua and SuperCollider since.",
    technologies: ["Lua", "SuperCollider", "Norns"],
    alias: "norns",
    kind: "sound",
    year: 2024,
  },
  {
    title: "MaxMSP Studies",
    description:
      "MaxMSP patches. A few exported with RNBO to run in the browser.",
    technologies: [
      "MaxMSP",
      "RNBO",
      "Jitter",
      "React",
      "TypeScript",
      "Next.js",
    ],
    alias: "max",
    kind: "sound",
    year: 2024,
  },
  {
    title: "3D & Photogrammetry",
    description:
      "Scans in RealityScan, cleanup in Blender, a few shown on the web with Three.js.",
    technologies: [
      "RealityScan",
      "Three.js",
      "React",
      "RealityCapture",
      "Blender",
      "Thinkercad",
    ],
    alias: "3dscanning",
    kind: "image",
    year: 2024,
  },
  {
    title: "Music Experiments",
    description:
      "Generative sketches in MaxMSP, norns and SuperCollider. Finished in Ableton.",
    technologies: [
      "MaxMSP",
      "SuperCollider",
      "Strudel.js",
      "Ableton Live",
      "Norns",
    ],
    alias: "music",
    kind: "sound",
    year: 2024,
  },
  {
    title: "Live Coding",
    description:
      "Sets at algoraves. Music and visuals written live.",
    alias: "livecoding",
    kind: "sound",
    technologies: ["Hydra", "P5.js", "Strudel", "MaxMSP", "SuperCollider"],
    year: 2023,
  },
  {
    title: "EcoBridge",
    description:
      "Open data on public finances. Global finalist, IBM Call for Code 2021.",
    technologies: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
    alias: "ecobridge",
    kind: "web",
    githubUrl: "https://github.com/EcoBridge-Team/ecosystem",
    liveUrl: "https://www.youtube.com/watch?v=eDPPhKLgn-o",
    year: 2020,
  },
];

/** Catalog number, newest highest: "13". */
export function projectNo(project: Project): string {
    return String(projects.length - projects.indexOf(project))
}

export function getProjectByAlias(alias: string): Project | undefined {
    return projects.find(project => project.alias === alias)
}

