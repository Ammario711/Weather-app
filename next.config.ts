/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.weatherbit.io',
        pathname: '/static/img/icons/**',
      },
    ],
  },
};

module.exports = nextConfig;