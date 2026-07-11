import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows isolated local/Playwright servers to run alongside the main dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
