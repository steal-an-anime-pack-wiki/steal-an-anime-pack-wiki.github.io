import type { NextConfig } from "next";
const basePath = ""; // github.io user site, never a project subpath

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: process.cwd(),
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
