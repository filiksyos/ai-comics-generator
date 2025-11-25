import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
