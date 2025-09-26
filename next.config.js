/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  // 不要使用 next export，保持 SSR/ISR
  output: 'standalone',
};
module.exports = nextConfig;
