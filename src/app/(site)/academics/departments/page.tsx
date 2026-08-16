import type { Metadata } from "next";
import { InteriorHero } from "@/components/interior-page";
import { ResponsiveTable } from "@/components/public-data";
import { Section, SectionHeading } from "@/components/section";
import { subjectHeads } from "@/content/verified-school-content";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Academic Departments", description: "Subject heads and academic leadership at Rubaare Secondary School.", alternates: { canonical: "/academics/departments" } };

export default function DepartmentsPage() {
  return <><InteriorHero intro={{ ...pageIntros.academics, eyebrow: "Departments", title: "Subject leadership.", description: "The 2026 academic leadership list identifies the teacher responsible for each subject area." }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "Departments", href: "/academics/departments" }]} /><Section className="bg-[var(--school-cream)]"><SectionHeading eyebrow="Academic Leadership" title="Subject heads." description="Verified subject and department leadership for 2026." /><div className="mt-8"><ResponsiveTable caption="Subject heads at Rubaare Secondary School" headers={["Subject / Department", "Subject Head"]} rows={subjectHeads.map(([name, subject]) => [subject, name])} /></div></Section></>;
}
