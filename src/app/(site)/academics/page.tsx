import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Academics", description: "Explore O-Level and A-Level education, subject leadership and academic performance at Rubaare Secondary School.", alternates: { canonical: "/academics" } };

export default function AcademicsPage() {
  return <><InteriorHero intro={{ ...pageIntros.academics, description: "Rubaare Secondary School offers O-Level and A-Level education across Arts and Sciences." }} breadcrumbs={[{ label: "Academics", href: "/academics" }]} /><TextBlockGrid eyebrow="Academic Structure" title="Pathways, subjects and results." description="Explore the school's verified academic information." blocks={[{ title: "O-Level", body: "A broad lower-secondary foundation for day and boarding learners.", href: "/academics/o-level" }, { title: "A-Level", body: "Advanced study through three principal subjects, General Paper and a subsidiary subject.", href: "/academics/a-level" }, { title: "Subject Leadership", body: "View subject areas and their academic leaders.", href: "/academics/departments" }, { title: "Academic Performance", body: "Review official UCE and UACE results for 2025 with the available 2024 comparisons.", href: "/academics/performance" }]} /></>;
}
