import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "feffanubyjbviwsvqbrc.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-1035c26f358e472891d943e94ede4902.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;