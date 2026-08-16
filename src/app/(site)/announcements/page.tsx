import type { Metadata } from "next";
import { InteriorHero, ListingSection } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getAnnouncements } from "@/sanity/content";

export const metadata: Metadata = { title: "Announcements", description: "Current official announcements from Rubaare Secondary School.", alternates: { canonical: "/announcements" } };

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <>
      <InteriorHero intro={{ ...pageIntros.news, eyebrow: "Announcements", title: "School announcements." }} breadcrumbs={[{ label: "Announcements", href: "/announcements" }]} />
      <ListingSection
        eyebrow="Notices"
        title="Current announcements."
        description="Published announcements appear here until their expiry date passes."
        emptyMessage="No announcements have been published."
        items={announcements.map((item) => ({
          title: item.title,
          meta: item.type,
          summary: item.message,
          href: item.ctaLink,
        }))}
      />
    </>
  );
}
