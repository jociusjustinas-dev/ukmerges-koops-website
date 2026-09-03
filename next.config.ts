import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orchid-grouse-384861.hostingersite.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
