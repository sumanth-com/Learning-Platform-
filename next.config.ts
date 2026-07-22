import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/module/:slug/topic/:topicSlug/challenge/:challengeId",
        destination: "/challenge/:slug/:challengeId",
        permanent: false,
      },
      {
        source: "/module/:slug/challenge/:challengeId",
        destination: "/challenge/:slug/:challengeId",
        permanent: false,
      },
      {
        source: "/module/:slug/topic/:topicSlug",
        destination: "/module/:slug?topic=:topicSlug",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
