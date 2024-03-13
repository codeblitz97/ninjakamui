/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 's4.anilist.co',
        port: '',
        protocol: 'https',
        pathname: '/**',
      },
      {
        hostname: 'i.ytimg.com',
        port: '',
        protocol: 'https',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
