import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rubaaress.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api", "/search?*", "/*?media=*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
