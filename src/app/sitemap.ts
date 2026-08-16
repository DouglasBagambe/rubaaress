import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/content/site";
import { getGalleryIndex, getNewsArticles } from "@/sanity/content";

const staticRoutes = [
  "/",
  "/about",
  "/about/history",
  "/about/headteacher",
  "/about/leadership",
  "/about/facilities",
  "/about/master-plan",
  "/about/mission-vision",
  "/academics",
  "/academics/o-level",
  "/academics/a-level",
  "/academics/departments",
  "/academics/performance",
  "/admissions",
  "/admissions/how-to-apply",
  "/admissions/requirements",
  "/admissions/fees-and-documents",
  "/admissions/faqs",
  "/school-life",
  "/news",
  "/events",
  "/announcements",
  "/gallery",
  "/downloads",
  "/contact",
  "/privacy",
  "/accessibility",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, gallery] = await Promise.all([getNewsArticles(), getGalleryIndex()]);
  const dynamicRoutes = [
    ...news.map((item) => `/news/${item.slug}`),
    ...gallery.albums.map((item) => `/gallery/${item.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${canonicalSiteUrl}${route}`,
  }));
}
