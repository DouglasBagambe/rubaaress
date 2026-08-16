import type { Metadata } from "next";
import Link from "next/link";
import { InteriorHero } from "@/components/interior-page";
import { ResponsiveTable } from "@/components/public-data";
import { Section, SectionHeading } from "@/components/section";
import { careersMasters, classTeachers, hostelLeadership, seniorAdministration, subjectHeads, timetableTeachers } from "@/content/verified-school-content";
import { pageIntros, schoolIdentity } from "@/lib/site-data";

export const metadata: Metadata = { title: "School Leadership", description: "Leadership and administration of Rubaare Secondary School for 2026.", alternates: { canonical: "/about/leadership" } };

export default function LeadershipPage() {
  return <><InteriorHero intro={{ ...pageIntros.about, eyebrow: "Leadership", title: "School leadership and administration.", description: "The 2026 leadership structure includes senior administration, academic leadership, class teachers and hostel leadership." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Leadership", href: "/about/leadership" }]} />
    <Section className="bg-[var(--school-cream)]"><SectionHeading eyebrow="Headteacher" title={schoolIdentity.headteacher} description="Headteacher of Rubaare Secondary School." /><Link href="/about/headteacher" className="mt-6 inline-flex min-h-11 items-center bg-[var(--school-blue)] px-5 text-sm font-bold text-white">View Headteacher profile</Link></Section>
    <Section className="bg-white"><SectionHeading eyebrow="Administration" title="Senior administration." description="The team supporting the day-to-day leadership of the school." /><div className="mt-8"><ResponsiveTable caption="Senior administration" headers={["Name", "Role"]} rows={seniorAdministration.map(([name, role]) => [name, role])} /></div></Section>
    <Section className="bg-[var(--school-cream)]"><SectionHeading eyebrow="Academic Leadership" title="Subject heads." description="Subject and department leadership for 2026." /><div className="mt-8"><ResponsiveTable caption="Subject heads" headers={["Name", "Subject / Department"]} rows={subjectHeads.map(([name, subject]) => [name, subject])} /></div><div className="mt-10 grid gap-5 md:grid-cols-2"><article className="bg-white p-6"><h3 className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">Timetable Teachers</h3><ul className="mt-4 grid gap-2 text-[var(--school-muted)]">{timetableTeachers.map((name) => <li key={name}>{name}</li>)}</ul></article><article className="bg-white p-6"><h3 className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">Careers Masters</h3><ul className="mt-4 grid gap-2 text-[var(--school-muted)]">{careersMasters.map((name) => <li key={name}>{name}</li>)}</ul></article></div></Section>
    <Section className="bg-white"><SectionHeading eyebrow="Class Leadership" title="Class teachers." description="Class teachers listed for the 2026 school year." /><div className="mt-8"><ResponsiveTable caption="Class teachers" headers={["Name", "Class"]} rows={classTeachers.map(([name, className]) => [name, className])} /></div></Section>
    <Section className="bg-[var(--school-cream)]"><SectionHeading eyebrow="Boarding" title="House and hostel leadership." description="Staff members responsible for hostel co-ordination and named hostel roles." /><div className="mt-8"><ResponsiveTable caption="House and hostel leadership" headers={["Name", "Role"]} rows={hostelLeadership.map(([name, role]) => [name, role])} /></div></Section>
  </>;
}
