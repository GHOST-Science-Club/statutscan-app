import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  webpack: (config, { dev }) => {  // ONLY FOR DEV!!!!!!!!!!
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules', '**/.next'],
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
