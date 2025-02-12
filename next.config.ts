import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kskxrvod79sqlfxd.public.blob.vercel-storage.com",
        pathname: "/Images/**",
      },
    ],
  },
};

export default nextConfig;
