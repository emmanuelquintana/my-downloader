/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ytimg.com', // Permite todas las miniaturas de YT
      },
      {
        protocol: 'https',
        hostname: '**.tiktokcdn.com', // Por si usas TikTok luego
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net', // Facebook/Instagram CDN
      },
      {
        protocol: 'https',
        hostname: '**.instagram.com', // Instagram general
      },
    ],
  },
};

export default nextConfig;