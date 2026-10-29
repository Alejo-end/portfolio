import { Project } from "@/app/types"

export const projects: Project[] = [
  {
    title: "Stray",
    description:
      "A spectral processor for a field recording, played from a MIDI keyboard. Play soft and the sound stays calm, play harder and it gets restless, then chaotic, moving around the room as it goes. Midterm for Programming in Max 1 at Sibelius Academy. The patch will be published soon.",
    software: ["Max 9", "MSP", "JavaScript", "Dante", "Bitwig"],
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
    software: ["KiCad", "FreeCAD", "Arduino", "PlatformIO", "Python"],
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
      materials: ["Squier Mustang", "copper-clad board"],
      software: ["KiCad", "Arduino", "Max"],
      githubUrl: "https://github.com/Alejo-end/midiguitar",
      liveUrl: "https://digital-fabrication-1baba0.gitlab.io/assignments/final-project.html",
    },
    year: 2026,
  },
  {
    title: "Mangler",
    description:
      "Live stereo sampler for norns. Granular, time-stretch, slices, filter, delay, reverb, and two layer decks that loop like a pedal. Scenes store whole sounds, orbit wanders between them, erosion wears the take down on each pass.",
    materials: ["norns"],
    software: ["Lua", "SuperCollider", "softcut"],
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
    materials: ["norns", "monome grid"],
    software: ["Lua", "PolyPerc"],
    alias: "snu",
    kind: "sound",
    githubUrl: "https://github.com/absurd-turtle/snu",
    year: 2026,
    galleryLayout: "grid",
  },
  {
    title: "H2H",
    description:
      "USB MIDI between two computers, both ways, no drivers. TRS MIDI in and out, type A or B. SysEx passes in one piece. One cable powers both sides. With only a charger, MIDI IN plays MIDI OUT. A panic button stops every note. Bare copper art under a thin OSP coat: each unit ages its own way. First batch soon on Tori.",
    materials: ["black FR-4", "OSP copper", "hardwood", "M2 spacers"],
    software: ["KiCad", "FreeCAD", "Python", "Arduino", "TinyUSB"],
    alias: "h2h",
    kind: "hardware",
    specs: [
      { label: "ports", value: "2 × USB-C MIDI · TRS in · TRS out" },
      { label: "mcu", value: "2 × XIAO RP2040" },
      { label: "case", value: "65.7 × 44.9 × 9.9 mm, PCB sandwich" },
      { label: "alt case", value: "62.4 × 47.3 × 10.4 mm, hardwood, PCB lid" },
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
      materials: ["copper-clad board", "3D-printed case"],
      software: ["KiCad", "FreeCAD", "Arduino", "TinyUSB"],
      githubUrl: "https://digital-fabrication-1baba0.gitlab.io/media/files/Midi2host.zip",
      liveUrl: "https://digital-fabrication-1baba0.gitlab.io/assignments/07_electronics-design.html",
    },
    year: 2026,
  },
  {
    title: "Analog Photography",
    description:
      "35mm on a Chinon CE-4 with a Pentax 50mm f/2.",
    materials: ["35mm film", "Chinon CE-4", "Pentax 50mm f/2"],
    alias: "film",
    kind: "image",
    year: 2025,
  },
  {
    title: "Sounds of the Weather Turning",
    description:
      "Max for Live effect. The live weather of a city moves a shimmer reverb, an echo, a delay and a Roar distortion, and draws the city's skyline under the sky of the hour. Version 2: Open-Meteo, no API key. Free on maxforlive.com soon.",
    software: ["Max for Live", "Ableton Live", "Max 9", "JavaScript", "p5.js", "Open-Meteo"],
    specs: [
      { label: "version", value: "2.0, 10.2026" },
      { label: "cities", value: "29, each with its own skyline" },
      { label: "dials", value: "air quality · temperature · humidity · wind · pollution · precipitation · pressure" },
      { label: "effects", value: "shimmer · echo · delay · Roar, ABL objects" },
      { label: "data", value: "Open-Meteo, every 10 minutes" },
    ],
    alias: "weather",
    kind: "sound",
    galleryLayout: "grid",
    prototype: {
      title: "Sounds of the Weather Turning 1.1",
      alias: "weather1",
      year: 2025,
      description:
        "The first version. Live air quality data from WAQI controls delay, reverb, echo and distortion. Needs a free WAQI API key. Started in the Computational Art class at Aalto.",
      software: ["Max for Live", "Ableton Live", "WAQI API"],
      // The listing holds 1.1 until version 2 goes up.
      githubUrl: "https://maxforlive.com/library/device/14101/sounds-of-the-weather-turning",
      liveUrl: "https://youtu.be/wVJ3n1L9Egk",
    },
    year: 2025,
  },
  {
    title: "3D Printed Pinhole Photography",
    description:
      "3D printed pinhole camera. Several pinhole sizes and films, developed at home.",
    materials: ["3D-printed body", "film"],
    alias: "photo",
    kind: "image",
    year: 2024,
  },
  {
    title: "Norns Studies",
    description:
      "Soldered a norns shield. Scripts in Lua and SuperCollider since.",
    materials: ["norns shield"],
    software: ["Lua", "SuperCollider"],
    alias: "norns",
    kind: "sound",
    year: 2024,
  },
  {
    title: "MaxMSP Studies",
    description:
      "MaxMSP patches. A few exported with RNBO to run in the browser.",
    software: ["Max", "RNBO", "Jitter", "React", "TypeScript", "Next.js"],
    alias: "max",
    kind: "sound",
    year: 2024,
  },
  {
    title: "3D & Photogrammetry",
    description:
      "Scans in RealityScan, cleanup in Blender, a few shown on the web with Three.js.",
    software: ["RealityScan", "RealityCapture", "Blender", "Tinkercad", "Three.js", "React"],
    alias: "3dscanning",
    kind: "image",
    year: 2024,
  },
  {
    title: "Music Experiments",
    description:
      "Generative sketches in MaxMSP, norns and SuperCollider. Finished in Ableton.",
    materials: ["norns"],
    software: ["Max", "SuperCollider", "Strudel", "Ableton Live"],
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
    software: ["Hydra", "p5.js", "Strudel", "Max", "SuperCollider"],
    year: 2023,
  },
  {
    title: "EcoBridge",
    description:
      "Open data on public finances. Global finalist, IBM Call for Code 2021.",
    software: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
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

