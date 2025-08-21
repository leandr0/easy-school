/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,   // 🚫 skip ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true,    // 🚫 skip TS errors during build
  },
};

module.exports = nextConfig;
