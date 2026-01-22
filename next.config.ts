import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow larger request bodies so formData() can parse videos up to ~50MB
    middlewareClientMaxBodySize: 50 * 1024 * 1024, // 50MB
  },

  devIndicators: false,
};

export default nextConfig;

