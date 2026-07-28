import { InteriorHero, ListingSection } from "@/components/interior-page";
import { pageIntros, upcomingEvents } from "@/lib/site-data";

export default function EventsPage() {
  return (
    <>
      <InteriorHero intro={pageIntros.events} breadcrumbs={[{ label: "Events", href: "/events" }]} />
      <ListingSection
        eyebrow="Calendar"
        title="Upcoming events."
        description="Events will appear with dates, venues and categories when published."
        emptyMessage="No upcoming events have been published."
        items={upcomingEvents.map((item) => ({
          title: item.title,
          meta: item.category,
          summary: item.description,
        }))}
      />
    </>
  );
}
