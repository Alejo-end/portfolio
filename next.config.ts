import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //reactStrictMode: true,
  poweredByHeader: false,
  // @vercel/blob 2.x can't be webpack-bundled (its OIDC dependency reads
  // module paths at import time); load it from node_modules at runtime.
  serverExternalPackages: ["@vercel/blob"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kskxrvod79sqlfxd.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
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
