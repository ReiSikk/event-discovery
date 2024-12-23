/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'hdhpocotckesuowltwtk.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
