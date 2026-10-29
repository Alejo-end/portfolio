import type { NextConfig } from "next";

const blobHost = "https://kskxrvod79sqlfxd.public.blob.vercel-storage.com";
const dev = process.env.NODE_ENV === "development";
// Preview deployments load the Vercel toolbar and its comment socket.
const preview = process.env.VERCEL_ENV === "preview";

// Next inlines its bootstrap scripts, and nonces would make every page
// dynamic, so scripts stay on 'unsafe-inline' but only from this origin.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}${preview ? " https://vercel.live" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${blobHost}${preview ? " https://vercel.live https://vercel.com" : ""}`,
  `media-src 'self' ${blobHost}`,
  "font-src 'self' data:",
  `connect-src 'self'${preview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src ${preview ? "https://vercel.live" : "'none'"}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  //reactStrictMode: true,
  poweredByHeader: false,
  // @vercel/blob 2.x can't be webpack-bundled (its OIDC dependency reads
  // module paths at import time); load it from node_modules at runtime.
  serverExternalPackages: ["@vercel/blob"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(blobHost).hostname,
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Old deep links used /projects?project=<alias>.
        source: "/projects",
        has: [{ type: "query", key: "project", value: "(?<alias>.+)" }],
        destination: "/projects/:alias",
        permanent: true,
      },
      {
        // The MIDI bridge is H2H's rev 1, shown on its page as the prototype.
        source: "/projects/midihost",
        destination: "/projects/h2h",
        permanent: true,
      },
      {
        // H2H was called 2Host until rev 3.
        source: "/projects/2host",
        destination: "/projects/h2h",
        permanent: true,
      },
      {
        // The MIDI Guitar now lives on the Reins page as its prototype.
        source: "/projects/midiguitar",
        destination: "/projects/reins",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Vercel already sends HSTS with preload on every deployment.
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
