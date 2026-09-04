import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows isolated local/Playwright servers to run alongside the main dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Emits .next/standalone/server.js so the container ships only traced
  // dependencies instead of all of node_modules. See docs/deployment/AZURE_CHEAPEST.md.
  output: "standalone",
};

export default nextConfig;
