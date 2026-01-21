import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Cloudflare Pages compatibility
  output: 'standalone',
  experimental: {
    // Enable if using Cloudflare Pages adapter
  },
};

const withMDX = createMDX();

export default withMDX(config);
