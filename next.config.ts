import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  images: {
    remotePatterns: [{
      hostname: "files.stripe.com",
    }] 
  }
};

export default nextConfig;
