import type { Metadata } from "next";
import Link from "next/link";
import { InteriorHero } from "@/components/interior-page";
import { MasterPlanLightbox } from "@/components/master-plan-lightbox";
import { Section, SectionHeading } from "@/components/section";
import { TemporaryImage } from "@/components/temporary-image";
import { pageIntros } from "@/lib/site-data";
import { getMasterPlan } from "@/sanity/content";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2";

export const metadata: Metadata = {
  title: "School Master Plan",
  description: "Proposed facilities and long-term campus development plans for Rubaare Secondary School.",
  alternates: { canonical: "/about/master-plan" },
};

export default async function MasterPlanPage() {
  const masterPlan = await getMasterPlan();
  const [overviewImage, ...supportingImages] = masterPlan.items;

  return (
    <>
      <InteriorHero
        intro={pageIntros.masterPlan}
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Master Plan", href: "/about/master-plan" },
        ]}
      />

      <Section className="bg-[var(--school-cream)]">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Proposed Development"
              title={masterPlan.pageTitle}
              description={masterPlan.introduction}
            />
            <p className="mt-6 text-base leading-7 text-[var(--school-muted)]">The images present proposed facilities and future campus development. They do not represent a construction schedule or completion status.</p>
            <Link href="/gallery" className={`mt-7 inline-flex min-h-12 items-center border border-[var(--school-blue)] px-6 text-sm font-bold text-[var(--school-blue)] hover:bg-[var(--school-blue)] hover:text-white ${focusClass}`}>
              View Gallery
            </Link>
          </div>
          <TemporaryImage image={overviewImage} className="aspect-[16/11]" imgClassName="object-contain bg-white" priority />
        </div>
      </Section>

      <Section className="bg-[var(--school-cream)]">
        <SectionHeading
          eyebrow="Current Development Status"
          title="Completed work and construction in progress."
          description="The water project and Junior Staff Quarters I are complete. A three-storeyed girls' dormitory is under construction after its launch on 11 August 2026. The renders below remain proposed master-plan concepts unless explicitly identified otherwise."
        />
      </Section>

      <Section className="bg-white">
        <SectionHeading
          eyebrow="Plan Images"
          title="Explore the proposed facilities."
          description="Open each official master-plan render for a larger view."
        />
        <div className="mt-10">
          <MasterPlanLightbox items={[overviewImage, ...supportingImages]} />
        </div>
      </Section>
    </>
  );
}
