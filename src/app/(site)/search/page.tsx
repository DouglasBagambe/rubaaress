import type { Metadata } from "next";
import Link from "next/link";
import { InteriorHero } from "@/components/interior-page";
import { Section, SectionHeading } from "@/components/section";
import { pageIntros } from "@/lib/site-data";
import { corePageSearchResults, filterSearchResults, normaliseQuery, type SearchResult } from "@/lib/search";
import { getAcademicContent, getAnnouncements, getDownloads, getEvents, getFacilities, getGalleryIndex, getNewsArticles, getSchoolLifeActivities } from "@/sanity/content";

export const metadata: Metadata = {
  title: "Search",
  description: "Search public Rubaare Secondary School website content.",
  robots: { index: false, follow: true },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = normaliseQuery((await searchParams).q);
  const [news, events, announcements, downloads, gallery, academics, schoolLife, facilities] = await Promise.all([
    getNewsArticles(),
    getEvents(),
    getAnnouncements(),
    getDownloads(),
    getGalleryIndex(),
    getAcademicContent(),
    getSchoolLifeActivities(),
    getFacilities(),
  ]);
  const sourceResults: SearchResult[] = [
    ...corePageSearchResults,
    ...news.map((item) => ({ title: item.title, type: "News", excerpt: item.excerpt, href: `/news/${item.slug}`, keywords: item.circularHref ? "term iii term 3 circular 18 august school fees career day visiting day" : undefined })),
    ...events.upcoming.map((item) => ({ title: item.title, type: "Event", excerpt: item.description, href: "/events" })),
    ...announcements.map((item) => ({ title: item.title, type: "Announcement", excerpt: item.message, href: "/announcements" })),
    ...downloads.map((item) => {
      const description = "description" in item && typeof item.description === "string" ? item.description : `${item.category} ${item.fileType}`;
      const href = "fileUrl" in item && typeof item.fileUrl === "string" ? item.fileUrl : "/downloads";
      return { title: item.title, type: "Download", excerpt: description, href };
    }),
    ...gallery.albums.map((item) => ({ title: item.title, type: "Gallery album", excerpt: item.shortDescription, href: `/gallery/${item.slug}` })),
    ...academics.programmes.map((item) => ({ title: item.title, type: "Academic programme", excerpt: item.body, href: item.id?.includes("a-level") ? "/academics/a-level" : "/academics/o-level" })),
    ...academics.departments.map((item) => ({ title: item.title, type: "Department", excerpt: item.body, href: "/academics/departments" })),
    ...schoolLife.map((item) => ({ title: item.title, type: "Student life", excerpt: item.body, href: "/school-life" })),
    ...facilities.map((item) => ({ title: item.title, type: "Facility", excerpt: item.body, href: "/about/facilities" })),
  ];
  const results = filterSearchResults(sourceResults, query);

  return (
    <>
      <InteriorHero intro={{ ...pageIntros.news, eyebrow: "Search", title: "Search the school website.", description: "Find public pages, news, gallery albums, downloads and school information." }} breadcrumbs={[{ label: "Search", href: "/search" }]} />
      <Section className="bg-white">
        <SectionHeading eyebrow="Search" title="Search public content." description="Search covers published public website content only." />
        <form action="/search" className="mt-8 flex flex-col gap-3 border border-[var(--school-border)] bg-[var(--school-cream)] p-4 sm:flex-row">
          <label className="sr-only" htmlFor="search-page-query">Search query</label>
          <input id="search-page-query" name="q" type="search" defaultValue={query} className="min-h-12 flex-1 border border-[var(--school-border)] bg-white px-4 text-base text-[var(--school-ink)]" />
          <button type="submit" className="min-h-12 bg-[var(--school-blue)] px-6 text-sm font-bold text-white">Search</button>
          {query ? <Link href="/search" className="flex min-h-12 items-center px-3 text-sm font-semibold text-[var(--school-blue-dark)] underline">Clear</Link> : null}
        </form>
        <p className="mt-6 text-sm font-semibold text-[var(--school-muted)]">{query ? `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"` : "Enter a search term to begin."}</p>
        {query && results.length === 0 ? (
          <div className="mt-8 border border-[var(--school-border)] bg-[var(--school-cream)] p-8">
            <p className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">No matching public content was found.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {results.map((result) => (
              <Link key={`${result.type}-${result.href}-${result.title}`} href={result.href} className="border border-[var(--school-border)] bg-white p-5 hover:border-[var(--school-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)]">
                <p className="text-sm font-bold text-[var(--school-gold)]">{result.type}</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">{result.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--school-muted)]">{result.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
