import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'culixo-recipe-images.s3.us-east-2.amazonaws.com', // Your S3 bucket domain
      'localhost'
    ],
    formats: ['image/avif', 'image/webp']
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even with type errors
    ignoreBuildErrors: true,
  }
};

export default nextConfig;