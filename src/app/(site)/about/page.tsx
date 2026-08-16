import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { ResponsiveTable, StatCards } from "@/components/public-data";
import { Section, SectionHeading } from "@/components/section";
import { officialAboutPreamble, verifiedEnrolment } from "@/content/verified-school-content";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = {
  title: { absolute: "About Rubaare Secondary School | Ntungamo, Uganda" },
  description: "Learn about Rubaare Secondary School (Rubaare SS), a mixed day and boarding school in Ntungamo District, including its history, mission, leadership and enrolment.",
  alternates: { canonical: "/about" },
};

const format = (value: number) => value.toLocaleString("en-US");

export default function AboutPage() {
  return <>
    <InteriorHero intro={{ ...pageIntros.about, description: officialAboutPreamble[0] }} breadcrumbs={[{ label: "About", href: "/about" }]} />
    <TextBlockGrid eyebrow="Our School" title="Rubaare Secondary School." description={officialAboutPreamble[0]} blocks={[
      { title: "Our History", body: officialAboutPreamble[1], href: "/about/history" },
      { title: "Our Foundation", body: officialAboutPreamble[2], href: "/about/mission-vision" },
      { title: "Leadership", body: "Meet the headteacher, senior administration, academic leadership, class teachers and hostel leadership.", href: "/about/leadership" },
      { title: "Facilities", body: "The school has essential utilities, a computer laboratory, boarding structures and documented campus development.", href: "/about/facilities" },
    ]} />
    <Section className="bg-white">
      <SectionHeading eyebrow="Current Enrolment" title={`${verifiedEnrolment.academicYear} school enrolment.`} description={`Official headline figures reported on ${verifiedEnrolment.reportingDateLabel}.`} />
      <div className="mt-8"><StatCards items={[
        { label: "Total Learners", value: format(verifiedEnrolment.headline.grandTotal) },
        { label: "Boarding Learners", value: format(verifiedEnrolment.headline.totalBoarding) },
        { label: "Day Scholars", value: format(verifiedEnrolment.headline.totalDay) },
      ]} /></div>
      <div className="mt-12"><h2 className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">Boarding and day scholars</h2><p className="mb-5 mt-3 text-sm leading-6 text-[var(--school-muted)]">Class-level boarding and day figures from the school&apos;s boarding and day enrolment record.</p><ResponsiveTable caption="Boarding and day scholars by class" headers={["Class", "Boarder Boys", "Boarder Girls", "Boarding Total", "Day Boys", "Day Girls", "Day Total"]} rows={verifiedEnrolment.boardingDayRows.map((row) => [row.className, row.boarderBoys, row.boarderGirls, row.boarderTotal, row.dayBoys, row.dayGirls, row.dayTotal])} footer={["Total", verifiedEnrolment.boardingDayTotals.boarderBoys, verifiedEnrolment.boardingDayTotals.boarderGirls, format(verifiedEnrolment.boardingDayTotals.boarding), verifiedEnrolment.boardingDayTotals.dayBoys, verifiedEnrolment.boardingDayTotals.dayGirls, format(verifiedEnrolment.boardingDayTotals.day)]} /></div>
    </Section>
  </>;
}
