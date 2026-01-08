import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["prosjektmarkedet-be.onrender.com"],
  },
};

export default nextConfig;