/** @type {import('next').NextConfig} */
const nextConfig = {
  // Target modern browsers only - eliminates legacy polyfills
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    // Use smaller default sizes for better performance
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Modern formats only
    formats: ['image/avif', 'image/webp'],
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // SWC minification
  swcMinify: true,
  
  // Reduce bundle size
  modularizeImports: {
    'framer-motion': {
      transform: 'framer-motion/dist/es/{{member}}',
    },
  },
};

module.exports = nextConfig;
