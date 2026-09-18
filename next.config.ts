import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Open up any Supabase project's storage + local dev origins for
    // admin-uploaded school images. Wildcards cover the project subdomain.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
    ],
    // Required allowlist in Next.js 16.
    qualities: [25, 50, 75, 100],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;