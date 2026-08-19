import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rubaaress.sc.ug" }],
        destination: "https://rubaaress.sc.ug/:path*",
        permanent: true,
      },
      { source: "/school-life/sports", destination: "/school-life#sports", permanent: true },
      { source: "/school-life/spiritual-life", destination: "/school-life#spiritual-life", permanent: true },
      { source: "/school-life/student-leadership", destination: "/school-life#student-life", permanent: true },
      { source: "/school-life/clubs", destination: "/school-life", permanent: true },
      { source: "/school-calendar", destination: "/events", permanent: true },
      { source: "/academics/results", destination: "/academics/performance", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
