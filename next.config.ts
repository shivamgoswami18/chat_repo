import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["prosjektmarkedet-be.onrender.com", "staticg.sportskeeda.com", "encrypted-tbn0.gstatic.com", "thumb.photo-ac.com"],
  },
};

export default nextConfig;