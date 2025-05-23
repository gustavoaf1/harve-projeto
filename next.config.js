/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['http://192.168.18.209:3000'], // ou a porta que estiver usando
  },
};

module.exports = nextConfig;