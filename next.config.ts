import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile Three.js packages for proper ESM handling
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // Webpack config for Three.js
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },

  // Empty turbopack config to silence warning in Next.js 16
  turbopack: {},
};

export default nextConfig;

