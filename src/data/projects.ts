import { Project } from "@/app/types"

export const projects: Project[] = [
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
    liveUrl:
      "https://maxforlive.com/library/device/14101/sounds-of-the-weather-turning",
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

