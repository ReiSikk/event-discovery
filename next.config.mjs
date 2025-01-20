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
        protocol: 'https',
        hostname: 'credible-apparel-63eacfb187.media.strapiapp.com',
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
