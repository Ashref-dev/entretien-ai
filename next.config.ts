import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

import "./env.mjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
  // serverComponentsExternalPackages: ["@prisma/client"],
};

module.exports = withContentlayer(nextConfig);
