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
      { title: "Facilities", body: "The school has electricity, a standby generator, solar power and clean water.", href: "/about/facilities" },
    ]} />
    <Section className="bg-white">
      <SectionHeading eyebrow="Current Enrolment" title={`${verifiedEnrolment.academicYear} school enrolment.`} description={`Official headline figures reported on ${verifiedEnrolment.reportingDateLabel}.`} />
      <div className="mt-8"><StatCards items={[
        { label: "Total Learners", value: format(verifiedEnrolment.headline.grandTotal) },
        { label: "Female", value: format(verifiedEnrolment.headline.totalFemale) },
        { label: "Male", value: format(verifiedEnrolment.headline.totalMale) },
        { label: "Boarding / Day", value: `${format(verifiedEnrolment.headline.totalBoarding)} / ${format(verifiedEnrolment.headline.totalDay)}` },
      ]} /></div>
      <div className="mt-12"><h2 className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">Class and stream enrolment</h2><p className="mb-5 mt-3 text-sm leading-6 text-[var(--school-muted)]">Male and female figures from the detailed total student enrolment sheet.</p><ResponsiveTable caption="Class and stream enrolment by sex" headers={["Class", "Stream", "Male", "Female", "Total"]} rows={verifiedEnrolment.detailedRows.map((row) => [row.className, row.stream, format(row.male), format(row.female), format(row.total)])} footer={["Total", "", format(verifiedEnrolment.headline.totalMale), format(verifiedEnrolment.headline.totalFemale), format(verifiedEnrolment.headline.grandTotal)]} /></div>
      <div className="mt-12"><h2 className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">Boarding and day scholars</h2><p className="mb-5 mt-3 text-sm leading-6 text-[var(--school-muted)]">Boarding and day figures are presented separately from the school&apos;s second official enrolment sheet.</p><ResponsiveTable caption="Boarding and day scholars by class" headers={["Class", "Boarder Boys", "Boarder Girls", "Boarding Total", "Day Boys", "Day Girls", "Day Total"]} rows={verifiedEnrolment.boardingDayRows.map((row) => [row.className, row.boarderBoys, row.boarderGirls, row.boarderTotal, row.dayBoys, row.dayGirls, row.dayTotal])} footer={["Total", 429, 637, "1,066", 195, 157, 352]} /></div>
    </Section>
  </>;
}
