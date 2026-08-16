import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api", "/search?*", "/*?media=*"],
    },
    sitemap: `${canonicalSiteUrl}/sitemap.xml`,
  };
}
