import path from "path";
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

  serverExternalPackages: [
    "@prisma/client",
    "@react-email/components",
    "@react-email/tailwind",
  ],
  transpilePackages: ["@shadergradient/react"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@shadergradient/react": path.resolve(
        process.cwd(),
        "node_modules/@shadergradient/react/dist/index.mjs",
      ),
    };
    return config;
  },
};

module.exports = withContentlayer(nextConfig);
