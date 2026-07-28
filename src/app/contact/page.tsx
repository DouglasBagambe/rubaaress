import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { LocationSection } from "@/components/location-section";
import { pageIntros, schoolIdentity } from "@/lib/site-data";

export default function ContactPage() {
  return (
    <>
      <InteriorHero intro={pageIntros.contact} breadcrumbs={[{ label: "Contact", href: "/contact" }]} />
      <TextBlockGrid
        eyebrow="Contact Details"
        title="Contact and directions."
        description="The contact page starts with location details and can expand as school channels are confirmed."
        blocks={[
          { title: "Location", body: schoolIdentity.location },
          { title: "Office", body: "Contact channels will be added after confirmation." },
        ]}
      />
      <LocationSection />
    </>
  );
}
