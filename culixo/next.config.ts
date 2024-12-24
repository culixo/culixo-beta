/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'culixo-recipe-images.s3.us-east-2.amazonaws.com',
      'localhost'
    ],
    formats: ['image/avif', 'image/webp']
  },
  // Add these configurations
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: true,
  }
};

export default nextConfig;