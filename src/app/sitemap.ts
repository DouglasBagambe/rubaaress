import type { MetadataRoute } from "next";
import { getGalleryIndex, getNewsArticles } from "@/sanity/content";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rubaaress.vercel.app";

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
  "/school-life/sports",
  "/school-life/clubs",
  "/school-life/student-leadership",
  "/school-life/spiritual-life",
  "/news",
  "/events",
  "/announcements",
  "/gallery",
  "/downloads",
  "/school-calendar",
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
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
