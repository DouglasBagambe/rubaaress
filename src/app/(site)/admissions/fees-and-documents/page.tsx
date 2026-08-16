import type { Metadata } from "next";
import Link from "next/link";
import { InteriorHero } from "@/components/interior-page";
import { PdfActions, ResponsiveTable } from "@/components/public-data";
import { Section, SectionHeading } from "@/components/section";
import { fees } from "@/content/verified-school-content";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Fees & Documents", description: "Official S1 and S5 Term 1 2026 fees and admission documents for Rubaare Secondary School.", alternates: { canonical: "/admissions/fees-and-documents" } };
const money = (value: number) => `UGX ${value.toLocaleString("en-US")}`;

export default function FeesDocumentsPage() {
  return <><InteriorHero intro={{ ...pageIntros.admissions, eyebrow: "Fees & Documents", title: "Official 2026 fee schedules.", description: "Term 1 fees are shown separately for boarders and day scholars." }} breadcrumbs={[{ label: "Admissions", href: "/admissions" }, { label: "Fees & Documents", href: "/admissions/fees-and-documents" }]} />
    {[fees.s1, fees.s5].map((schedule, index) => <Section key={schedule.label} className={index % 2 ? "bg-white" : "bg-[var(--school-cream)]"}><SectionHeading eyebrow="Term 1 Fees" title={schedule.label} description="Fees must be paid through the phone using Sure Pay. A bank charge of UGX 2,000 is paid on each part payment." /><div className="mt-8"><ResponsiveTable caption={`${schedule.label} fees`} headers={["Item", "Boarder", "Day Scholar"]} rows={schedule.rows.map(([item, boarder, day]) => [item, money(boarder), money(day)])} footer={["Total", money(schedule.total[0]), money(schedule.total[1])]} /></div><PdfActions href={index === 0 ? "/downloads/s1-fees-term-1-2026.pdf" : "/downloads/s5-fees-term-1-2026.pdf"} title={`${schedule.label} Fees`} /></Section>)}
    <Section className="bg-[var(--school-cream)]"><SectionHeading eyebrow="Admission Documents" title="Forms, requirements and complete packs." description="All official public admission documents are available in the download library." /><Link href="/downloads" className="mt-6 inline-flex min-h-12 items-center bg-[var(--school-blue)] px-6 text-sm font-bold text-white">View all downloads</Link></Section>
  </>;
}
