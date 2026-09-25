import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/destinations',
        destination: '/home',
        permanent: false,
      },
      {
        source: '/destinations/:path*',
        destination: '/home',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
