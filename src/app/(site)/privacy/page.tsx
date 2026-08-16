import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Privacy", description: "Privacy information for the Rubaare Secondary School website." };

export default function PrivacyPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.contact, eyebrow: "Privacy", title: "Privacy information." }} breadcrumbs={[{ label: "Privacy", href: "/privacy" }]} />
      <TextBlockGrid
        eyebrow="Website Privacy"
        title="How website information is handled."
        description="How information submitted through this website and its connected services is handled."
        blocks={[
          { title: "Forms", body: "Information submitted through website forms is used to respond to enquiries and is not stored in the public Sanity dataset." },
          { title: "Services", body: "The site uses Sanity-hosted public content, Google Maps links or embeds, and hosted media for published school information." },
          { title: "Logs", body: "Hosting providers may keep technical logs needed for security, reliability and abuse prevention." },
          { title: "Contact", body: "Use the published school telephone or email address for privacy questions." },
        ]}
      />
    </>
  );
}
