import { InteriorHero, ListingSection } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getEvents } from "@/sanity/content";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <InteriorHero intro={pageIntros.events} breadcrumbs={[{ label: "Events", href: "/events" }]} />
      <ListingSection
        eyebrow="Calendar"
        title="Upcoming events."
        description="Events will appear with dates, venues and categories when published."
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
