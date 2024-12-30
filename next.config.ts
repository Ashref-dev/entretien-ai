import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

import "./env.mjs";

const nextConfig: NextConfig = {
  output: "standalone",

  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

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
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  // new NEXT JS 15 naming convention
  serverExternalPackages: [
    "@prisma/client",
    "@react-email/components",
    "@react-email/tailwind",
  ],
};

module.exports = withContentlayer(nextConfig);
