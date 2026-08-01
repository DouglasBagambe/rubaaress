import Link from "next/link";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { LocationSection } from "@/components/location-section";
import { PublicForm } from "@/components/public-form";
import { Section, SectionHeading } from "@/components/section";
import { pageIntros } from "@/lib/site-data";
import { getSiteSettings } from "@/sanity/content";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <InteriorHero intro={pageIntros.contact} breadcrumbs={[{ label: "Contact", href: "/contact" }]} />
      <TextBlockGrid
        eyebrow="Contact Details"
        title="Contact and directions."
        description="Use the verified telephone number, postal address and map link for Rubaare Secondary School."
        blocks={[
          { title: "Location", body: settings.physicalLocation },
          { title: "Telephone", body: settings.primaryTelephone },
          { title: "Postal Address", body: settings.postalAddress },
          { title: "Email", body: settings.email ?? "Official school email address still required." },
        ]}
      />
      <Section className="bg-white">
        <SectionHeading eyebrow="Direct Contacts" title="Reach the school office." description="The verified phone number and location link are active for calls and directions." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a href={settings.primaryTelephoneHref} className={`border-l-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5 font-bold text-[var(--school-blue-dark)] hover:bg-white hover:shadow-sm ${focusClass}`}>
            Call {settings.primaryTelephone}
          </a>
          <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={`border-l-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5 font-bold text-[var(--school-blue-dark)] hover:bg-white hover:shadow-sm ${focusClass}`}>
            Open Google Maps
          </a>
          <Link href="/downloads" className={`border-l-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5 font-bold text-[var(--school-blue-dark)] hover:bg-white hover:shadow-sm ${focusClass}`}>
            View Downloads
          </Link>
        </div>
      </Section>
      <Section className="bg-[var(--school-cream)]">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading eyebrow="Message" title="Send a general enquiry." description="Messages are validated server-side. Email delivery requires provider credentials before production launch." />
          <PublicForm kind="contact" />
        </div>
      </Section>
      <LocationSection settings={settings} />
    </>
  );
}
