/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
  images: {
    domains: ["supabase.co", "*.supabase.co"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;
