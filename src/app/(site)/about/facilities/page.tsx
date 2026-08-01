import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getFacilities } from "@/sanity/content";

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  return (
    <>
      <InteriorHero intro={{ ...pageIntros.about, eyebrow: "Facilities", title: "School facilities." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Facilities", href: "/about/facilities" }]} />
      <TextBlockGrid
        eyebrow="Facilities"
        title="Learning environment."
        description="Facilities are published only when supported by supplied and confirmed school content."
        blocks={facilities.length ? facilities : [{ title: "Facilities", body: "Facility details will be published after school confirmation." }]}
      />
    </>
  );
}
