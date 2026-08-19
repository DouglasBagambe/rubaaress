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
        description="Confirmed school events are listed with their known dates, times and venues."
        emptyMessage="No upcoming events have been published."
        items={events.upcoming.map((item) => ({
          title: item.title,
          meta: [formatEventDate(item.startDate, item.endDate), item.venue].filter(Boolean).join(" · "),
          summary: item.description,
        }))}
      />
    </>
  );
}

function formatEventDate(startDate?: string, endDate?: string) {
  if (!startDate) return "";
  const formatter = new Intl.DateTimeFormat("en-UG", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Kampala" });
  const start = formatter.format(new Date(`${startDate.slice(0, 10)}T12:00:00Z`));
  if (!endDate) return start;
  return `${start} – ${formatter.format(new Date(`${endDate.slice(0, 10)}T12:00:00Z`))}`;
}
