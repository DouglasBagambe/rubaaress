import type { Metadata } from "next";
import Link from "next/link";
import { InteriorHero } from "@/components/interior-page";
import { PdfActions, ResponsiveTable } from "@/components/public-data";
import { Section, SectionHeading } from "@/components/section";
import { fees } from "@/content/verified-school-content";
import { termThreeAdditionalFees, termThreeFees } from "@/content/school-updates";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Fees & Documents", description: "Current Term III 2026 fees and official admission documents for Rubaare Secondary School.", alternates: { canonical: "/admissions/fees-and-documents" } };
const money = (value: number) => `UGX ${value.toLocaleString("en-US")}`;

export default function FeesDocumentsPage() {
  return <><InteriorHero intro={{ ...pageIntros.admissions, eyebrow: "Fees & Documents", title: "Official 2026 fee information.", description: "Current Term III fees and earlier official Term I documents are clearly identified by term and year." }} breadcrumbs={[{ label: "Admissions", href: "/admissions" }, { label: "Fees & Documents", href: "/admissions/fees-and-documents" }]} />
    <Section className="bg-[var(--school-cream)]">
      <SectionHeading eyebrow="Current Fees" title="Term III 2026 School Fees" description="Parents and guardians are required to pay at least half of the school fees before bringing children to school." />
      <div className="mt-8"><ResponsiveTable caption="Term III 2026 school fees" headers={["Class", "Day Scholar", "Boarding"]} rows={termThreeFees.map((row) => [row.className, money(row.day), money(row.boarding)])} /></div>
      <div className="mt-8 border-l-4 border-[var(--school-gold)] bg-white p-6 text-sm leading-7 text-[var(--school-ink)]">
        <p>Fees are paid through the approved RUSCA SACCO / MSACCO payment process. Parents should use the official school fee bill or contact the school for the current payment code.</p>
        <p className="mt-3">The complete payment instructions, requirements and additional fees are provided in the official circular.</p>
      </div>
      <div className="mt-8"><ResponsiveTable caption="Term III 2026 additional fees" headers={["Additional item", "Amount"]} rows={termThreeAdditionalFees.map(([item, amount]) => [item, money(amount)])} /></div>
      <p className="mt-4 text-sm leading-6 text-[var(--school-muted)]">The circular states that these additional monies are payable at school on reporting day.</p>
      <PdfActions href="/downloads/communication-from-school-18-august-2026.pdf" title="Communication from School — 18 August 2026" />
    </Section>
    {[fees.s1, fees.s5].map((schedule, index) => <Section key={schedule.label} className={index % 2 ? "bg-[var(--school-cream)]" : "bg-white"}><SectionHeading eyebrow="Earlier Official Document" title={schedule.label} description="Historical official Term I 2026 fee schedule retained for reference. It is separate from the current Term III 2026 fees above." /><div className="mt-8"><ResponsiveTable caption={`${schedule.label} fees`} headers={["Item", "Boarder", "Day Scholar"]} rows={schedule.rows.map(([item, boarder, day]) => [item, money(boarder), money(day)])} footer={["Total", money(schedule.total[0]), money(schedule.total[1])]} /></div><PdfActions href={index === 0 ? "/downloads/s1-fees-term-1-2026.pdf" : "/downloads/s5-fees-term-1-2026.pdf"} title={`${schedule.label} Fees`} /></Section>)}
    <Section className="bg-[var(--school-cream)]"><SectionHeading eyebrow="Admission Documents" title="Forms, requirements and complete packs." description="All official public admission documents are available in the download library." /><Link href="/downloads" className="mt-6 inline-flex min-h-12 items-center bg-[var(--school-blue)] px-6 text-sm font-bold text-white">View all downloads</Link></Section>
  </>;
}
