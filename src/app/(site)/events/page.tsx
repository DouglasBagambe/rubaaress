import type { Metadata } from "next";
import { InteriorHero, ListingSection } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getEvents } from "@/sanity/content";

export const metadata: Metadata = { title: "Events", description: "Official events from Rubaare Secondary School.", alternates: { canonical: "/events" } };

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <InteriorHero intro={pageIntros.events} breadcrumbs={[{ label: "Events", href: "/events" }]} />
      <ListingSection
        eyebrow="Calendar"
        title="Upcoming events."
        description="Confirmed school events are listed with their dates and venues."
        emptyMessage="No upcoming events have been published."
        items={events.upcoming.map((item) => ({
          title: item.title,
          meta: item.category,
          summary: item.description,
        }))}
      />
    </>
  );
}
