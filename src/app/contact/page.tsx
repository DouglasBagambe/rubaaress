import Link from "next/link";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { LocationSection } from "@/components/location-section";
import { Section, SectionHeading } from "@/components/section";
import { pageIntros, schoolIdentity } from "@/lib/site-data";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2";

export default function ContactPage() {
  return (
    <>
      <InteriorHero intro={pageIntros.contact} breadcrumbs={[{ label: "Contact", href: "/contact" }]} />
      <TextBlockGrid
        eyebrow="Contact Details"
        title="Contact and directions."
        description="Use the verified telephone number, postal address and map link for Rubaare Secondary School."
        blocks={[
          { title: "Location", body: schoolIdentity.location },
          { title: "Telephone", body: schoolIdentity.phoneDisplay },
          { title: "Postal Address", body: schoolIdentity.postalAddress },
          { title: "Email", body: schoolIdentity.email ?? "Official school email address still required." },
        ]}
      />
      <Section className="bg-white">
        <SectionHeading eyebrow="Direct Contacts" title="Reach the school office." description="The verified phone number and location link are active for calls and directions." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a href={schoolIdentity.phoneHref} className={`border-l-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5 font-bold text-[var(--school-blue-dark)] hover:bg-white hover:shadow-sm ${focusClass}`}>
            Call {schoolIdentity.phoneDisplay}
          </a>
          <a href={schoolIdentity.mapsUrl} target="_blank" rel="noopener noreferrer" className={`border-l-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5 font-bold text-[var(--school-blue-dark)] hover:bg-white hover:shadow-sm ${focusClass}`}>
            Open Google Maps
          </a>
          <Link href="/downloads" className={`border-l-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5 font-bold text-[var(--school-blue-dark)] hover:bg-white hover:shadow-sm ${focusClass}`}>
            View Downloads
          </Link>
        </div>
      </Section>
      <LocationSection />
    </>
  );
}
