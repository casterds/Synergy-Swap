/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4943/:path*' // Proxy to Backend
      }
    ]
  }
};

module.exports = nextConfig;
