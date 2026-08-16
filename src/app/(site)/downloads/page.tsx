import type { Metadata } from "next";
import { InteriorHero } from "@/components/interior-page";
import { PdfActions } from "@/components/public-data";
import { Section, SectionHeading } from "@/components/section";
import { publicDownloads } from "@/content/verified-school-content";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download official Rubaare Secondary School admission packs, fee schedules, forms, requirements, rules and academic results.",
  alternates: { canonical: "/downloads" },
};

const categoryOrder = ["Admission Packs", "Admissions", "Fees & Requirements", "Policies & Forms", "Academic Results"] as const;

export default function DownloadsPage() {
  return (
    <>
      <InteriorHero intro={pageIntros.downloads} breadcrumbs={[{ label: "Downloads", href: "/downloads" }]} />
      {categoryOrder.map((category, index) => {
        const documents = publicDownloads.filter((item) => item.category === category);
        if (!documents.length) return null;

        return (
          <Section key={category} className={index % 2 === 0 ? "bg-[var(--school-cream)]" : "bg-white"}>
            <SectionHeading eyebrow="Official Documents" title={category} description="View a document in your browser or download a local PDF copy." />
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <article key={document.href} className="border border-[var(--school-border)] bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-[var(--school-gold)]">PDF · {document.size}</p>
                  <h2 className="mt-3 font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">{document.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--school-muted)]">{document.description}</p>
                  <PdfActions href={document.href} title={document.title} />
                </article>
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
}
