import type { Metadata } from "next";
import { InteriorHero } from "@/components/interior-page";
import { PdfActions, ResponsiveTable, StatCards } from "@/components/public-data";
import { Section, SectionHeading } from "@/components/section";
import { academicResults } from "@/content/verified-school-content";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Academic Performance", description: "Official UCE and UACE 2025 academic results for Rubaare Secondary School, with available 2024 comparison data.", alternates: { canonical: "/academics/performance" } };

export default function PerformancePage() {
  return <><InteriorHero intro={{ ...pageIntros.academics, eyebrow: "Academic Performance", title: "UCE and UACE results.", description: "Official 2025 results with the available 2024 comparison figures." }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "Academic Performance", href: "/academics/performance" }]} />
    <Section className="bg-[var(--school-cream)]"><SectionHeading eyebrow="UACE 2025" title="Advanced Level results summary." description="The official school results summary records 132 learners in the points distribution." /><div className="mt-8"><StatCards items={[{ label: "UACE Learners", value: "132", note: "2025 points distribution total" }, { label: "University Education", value: "86", note: "Learners who qualify" }, { label: "Diploma", value: "33", note: "Learners who qualify" }]} /></div><div className="mt-10"><ResponsiveTable caption="UACE 2025 points distribution" headers={["Points", "Learners"]} rows={academicResults.uace2025.points.map(([points, learners]) => [points, learners])} footer={["Total", 132]} /></div></Section>
    <Section className="bg-white"><SectionHeading eyebrow="UCE" title="2025 letter grades and results classification." description="A, B, C, D and E figures are letter-grade counts, not learner totals." /><div className="mt-8"><ResponsiveTable caption="UCE letter-grade counts for 2025 and 2024" headers={["Year", "A", "B", "C", "D", "E"]} rows={academicResults.uce.grades.map((row) => [row.year, row.A, row.B, row.C, row.D, row.E])} /></div><div className="mt-8"><ResponsiveTable caption="UCE results classification for 2025 and 2024" headers={["Year", "Result 1", "Result 2", "Result 3", "Result 4"]} rows={academicResults.uce.classifications.map((row) => [row.year, row.result1, row.result2, row.result3, row.result4])} /></div></Section>
    <Section className="bg-[var(--school-cream)]"><SectionHeading eyebrow="UACE Comparison" title="2025 and 2024 points distribution." description="The comparison below reproduces the point bands included in the official school source." /><div className="mt-8"><ResponsiveTable caption="UACE points comparison for 2025 and 2024" headers={["Year", ...academicResults.uaceComparison.points.map(String)]} rows={academicResults.uaceComparison.rows.map((row) => [row.year, ...row.counts])} /></div></Section>
    <Section className="bg-white"><SectionHeading eyebrow="Official Document" title="Download the academic results." description="View or download the official UCE and UACE 2025 results summary." /><PdfActions href="/downloads/academic-results-uce-uace-2025.pdf" title="UCE & UACE 2025 Academic Results" /></Section>
  </>;
}
