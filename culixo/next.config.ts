import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'culixo-recipe-images.s3.us-east-2.amazonaws.com', // Your S3 bucket domain
      'localhost'
    ],
    // Optionally, you can also specify image formats you want to optimize
    formats: ['image/avif', 'image/webp']
  }
};

export default nextConfig;