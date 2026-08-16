import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { PdfActions } from "@/components/public-data";
import { Section, SectionHeading } from "@/components/section";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "O-Level", description: "Learn about O-Level education and admission preparation at Rubaare Secondary School.", alternates: { canonical: "/academics/o-level" } };

export default function OLevelPage() {
  return <><InteriorHero intro={{ ...pageIntros.academics, eyebrow: "O-Level", title: "O-Level education.", description: "Rubaare Secondary School provides O-Level education for day and boarding learners within its broad Arts and Sciences programme." }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "O-Level", href: "/academics/o-level" }]} /><TextBlockGrid eyebrow="Lower Secondary" title="A broad academic foundation." description="The school's subject leadership spans languages, sciences, humanities, creative subjects, agriculture, business, computing and physical education." blocks={[{ title: "Academic Leadership", body: "The subject-head list identifies the teachers responsible for the school's academic subject areas.", href: "/academics/departments" }, { title: "Progression", body: "The school also offers A-Level education across Arts and Science subjects.", href: "/academics/a-level" }, { title: "Admission Preparation", body: "O-Level entrants should review reporting documents, personal items, uniform and boarding requirements.", href: "/admissions/requirements" }]} /><Section className="bg-white"><SectionHeading eyebrow="O-Level Admissions" title="Official 2026 admission pack." description="Download the complete O-Level admission letter, school rules, forms, fees and requirements." /><PdfActions href="/downloads/o-level-admission-pack-2026.pdf" title="O-Level Admission Pack 2026" /></Section></>;
}
