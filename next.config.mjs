/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/blog",
  experimental: {
    cpus: 1
  },
  async rewrites() {
    return [
      {
        source: '/wp-media/:path*',
        destination: 'https://red-tiger-788578.hostingersite.com/wp-content/:path*'
      }
    ];
  }
};

export default nextConfig;
