import { InteriorHero, ListingSection } from "@/components/interior-page";
import { downloads, pageIntros } from "@/lib/site-data";

export default function DownloadsPage() {
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
