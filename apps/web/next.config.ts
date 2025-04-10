import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@repo/ui"],
  experimental: {
    externalDir: true,
  }
};

export default nextConfig;
