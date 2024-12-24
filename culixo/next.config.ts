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
  typescript: {
    ignoreBuildErrors: true, // Add this
  },
  eslint: {
    ignoreDuringBuilds: true, // Add this
  },
  experimental: {
    missingSuspenseWithCSRBailout: true
  }
};

module.exports = nextConfig;