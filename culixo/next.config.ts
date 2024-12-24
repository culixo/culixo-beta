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
  experimental: {
    missingSuspenseWithCSRBailout: true // This should help bypass the useSearchParams error
  }
};

module.exports = nextConfig;