import { InteriorHero, ListingSection } from "@/components/interior-page";
import { latestNews, pageIntros } from "@/lib/site-data";

export default function NewsPage() {
  return (
    <>
      <InteriorHero intro={pageIntros.news} breadcrumbs={[{ label: "News", href: "/news" }]} />
      <ListingSection
        eyebrow="News Archive"
        title="Latest news."
        description="School announcements and community stories are prepared for CMS publishing."
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
