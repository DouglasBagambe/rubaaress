import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Accessibility", description: "Keyboard, readability and accessibility support on the Rubaare Secondary School website.", alternates: { canonical: "/accessibility" } };

export default function AccessibilityPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.contact, eyebrow: "Accessibility", title: "Accessibility statement." }} breadcrumbs={[{ label: "Accessibility", href: "/accessibility" }]} />
      <TextBlockGrid
        eyebrow="Access"
        title="Practical accessibility support."
        description="The website aims to be readable, keyboard accessible and usable across screen sizes."
        blocks={[
          { title: "Keyboard Use", body: "Navigation, menus, forms and gallery controls are designed to work with keyboard focus." },
          { title: "Readable Content", body: "The site uses clear contrast, meaningful headings, responsive layouts and alternative text for important images." },
          { title: "Report a Problem", body: "Visitors can report accessibility issues using the published school telephone or email address." },
        ]}
      />
    </>
  );
}
