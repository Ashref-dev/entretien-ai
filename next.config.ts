const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

const nextConfig: import("next").NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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



  serverComponentsExternalPackages: ["@prisma/client"],
};

module.exports = withContentlayer(nextConfig);
