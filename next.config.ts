import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      {
        protocol: "https",
        hostname: "cdn.standardmedia.co.ke",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
