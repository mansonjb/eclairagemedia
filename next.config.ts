import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/liseuse", destination: "/read", permanent: true }];
  },
};

export default nextConfig;
