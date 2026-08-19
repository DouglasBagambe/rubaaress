import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Privacy", description: "How enquiries and public website information are handled by the Rubaare Secondary School website.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.contact, eyebrow: "Privacy", title: "Privacy information." }} breadcrumbs={[{ label: "Privacy", href: "/privacy" }]} />
      <TextBlockGrid
        eyebrow="Website Privacy"
        title="How website information is handled."
        description="How information submitted through this website and its connected services is handled."
        blocks={[
          { title: "Forms", body: "Information submitted through website forms is used to respond to enquiries. It is transmitted through the website's email-delivery service to the designated school inbox and is not published in the public Sanity dataset." },
          { title: "Services", body: "Vercel hosts the website, Sanity hosts public CMS content, and Google Maps may be used for maps or location links." },
          { title: "Logs", body: "Infrastructure providers may maintain technical logs needed for reliability, security and abuse prevention." },
          { title: "Contact", body: "Use the published school telephone or email address for privacy questions." },
        ]}
      />
    </>
  );
}
