/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'red-tiger-788578.hostingersite.com'
      }
    ]
  }
};

export default nextConfig;
