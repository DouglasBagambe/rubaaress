import type { Metadata } from "next";
import { InteriorHero, ListingSection } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getDownloads } from "@/sanity/content";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Access official Rubaare Secondary School forms, circulars, calendars and other published school documents.",
  alternates: { canonical: "/downloads" },
};

export default async function DownloadsPage() {
  const downloads = await getDownloads();

  return (
    <>
      <InteriorHero intro={pageIntros.downloads} breadcrumbs={[{ label: "Downloads", href: "/downloads" }]} />
      <ListingSection
        eyebrow="Documents"
        title="Document library."
        description="Forms, circulars and calendars are organised for upload and publication."
        items={downloads.map((item) => ({
          title: item.title,
          meta: `${item.category} · ${item.fileType}`,
          summary: `${item.fileSize} · ${item.publicationDate}`,
        }))}
      />
    </>
  );
}
