import type { Metadata } from "next";
import { InteriorHero, ListingSection } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getNewsArticles } from "@/sanity/content";

export const metadata: Metadata = { title: "News", description: "Official news from Rubaare Secondary School.", alternates: { canonical: "/news" } };

export default async function NewsPage() {
  const latestNews = await getNewsArticles();

  return (
    <>
      <InteriorHero intro={pageIntros.news} breadcrumbs={[{ label: "News", href: "/news" }]} />
      <ListingSection
        eyebrow="News Archive"
        title="Latest news."
        description="Official school news is published here."
        emptyMessage="No current news has been published."
        items={latestNews.map((item) => ({
          title: item.title,
          meta: item.publishedAt ? `${item.category} · ${item.publishedAt}` : item.category,
          summary: item.excerpt,
          href: `/news/${item.slug}`,
        }))}
      />
    </>
  );
}
