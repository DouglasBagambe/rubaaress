import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { PublicForm } from "@/components/public-form";
import { Section, SectionHeading } from "@/components/section";
import { pageIntros } from "@/lib/site-data";
import { getAdmissions } from "@/sanity/content";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Find admissions guidance for day and boarding students applying to O-Level or A-Level at Rubaare Secondary School in Ntungamo District.",
  alternates: { canonical: "/admissions" },
};

export default async function AdmissionsPage() {
  const admissions = await getAdmissions();

  return (
    <>
      <InteriorHero intro={pageIntros.admissions} breadcrumbs={[{ label: "Admissions", href: "/admissions" }]} />
      <TextBlockGrid
        eyebrow="Apply"
        title="Admissions information."
        description={admissions.introduction}
        blocks={admissions.blocks}
      />
      <Section className="bg-white">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading eyebrow="Enquiry" title="Ask about admissions." description="Use this concise enquiry form for admissions questions only. It is not an online application system." />
          <PublicForm kind="admissions" />
        </div>
      </Section>
    </>
  );
}
