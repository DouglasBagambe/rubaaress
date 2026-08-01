import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { Section, SectionHeading } from "@/components/section";
import { pageIntros } from "@/lib/site-data";
import { getCurrentEnrolment, getSiteSettings } from "@/sanity/content";

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

export default async function AboutPage() {
  const [settings, enrolment] = await Promise.all([getSiteSettings(), getCurrentEnrolment()]);

  return (
    <>
      <InteriorHero intro={pageIntros.about} breadcrumbs={[{ label: "About", href: "/about" }]} />
      <TextBlockGrid
        eyebrow="School Profile"
        title="School profile sections."
        description={`${settings.mission} ${settings.vision}`}
        blocks={[
          { title: "School History", body: "A dedicated history page is ready for confirmed founding details and milestones.", href: "/about/history" },
          { title: "Mission, Vision & Values", body: `${settings.mission} ${settings.vision}`, href: "/about/mission-vision" },
          { title: "Leadership", body: "Leadership profiles include the headteacher and school administration structure.", href: "/about/leadership" },
          { title: "Master Plan", body: "The school master plan presents proposed future development for facilities and student experience.", href: "/about/master-plan" },
          { title: "Facilities", body: "Campus and facilities information will expand as school photography and descriptions are supplied." },
        ]}
      />
      <Section className="bg-white">
        <SectionHeading
          eyebrow="School Profile"
          title={`${enrolment.academicYear} Student Enrolment`}
          description={`${settings.schoolName} had ${formatNumber(enrolment.totals.grandTotal)} learners recorded as of ${enrolment.reportingDateLabel}.`}
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="overflow-x-auto border border-[var(--school-border)] bg-white shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <caption className="sr-only">Class-by-class student enrolment as of {enrolment.reportingDateLabel}</caption>
              <thead className="bg-[var(--school-blue-dark)] text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">Class</th>
                  <th scope="col" className="px-4 py-3 font-bold">Female Day</th>
                  <th scope="col" className="px-4 py-3 font-bold">Female Boarding</th>
                  <th scope="col" className="px-4 py-3 font-bold">Male Day</th>
                  <th scope="col" className="px-4 py-3 font-bold">Male Boarding</th>
                  <th scope="col" className="px-4 py-3 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {enrolment.rows.map((row) => (
                  <tr key={row.className} className="border-t border-[var(--school-border)] odd:bg-white even:bg-[var(--school-cream)]/45">
                    <th scope="row" className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{row.className}</th>
                    <td className="px-4 py-3 text-[var(--school-ink)]">{formatNumber(row.femaleDay)}</td>
                    <td className="px-4 py-3 text-[var(--school-ink)]">{formatNumber(row.femaleBoarding)}</td>
                    <td className="px-4 py-3 text-[var(--school-ink)]">{formatNumber(row.maleDay)}</td>
                    <td className="px-4 py-3 text-[var(--school-ink)]">{formatNumber(row.maleBoarding)}</td>
                    <td className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{formatNumber(row.total)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[var(--school-blue)] bg-[var(--school-gold)]/15">
                  <th scope="row" className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">Total</th>
                  <td className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{formatNumber(enrolment.totals.femaleDay)}</td>
                  <td className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{formatNumber(enrolment.totals.femaleBoarding)}</td>
                  <td className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{formatNumber(enrolment.totals.maleDay)}</td>
                  <td className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{formatNumber(enrolment.totals.maleBoarding)}</td>
                  <td className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{formatNumber(enrolment.totals.grandTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid content-start gap-3 border-l-4 border-[var(--school-gold)] bg-[var(--school-blue-dark)] p-5 text-sm text-blue-50 shadow-sm">
            <p className="font-bold text-[var(--school-gold)]">Summary</p>
            <p className="text-white">Female learners: {formatNumber(enrolment.totals.totalFemale)}</p>
            <p className="text-white">Male learners: {formatNumber(enrolment.totals.totalMale)}</p>
            <p className="text-white">Day learners: {formatNumber(enrolment.totals.totalDay)}</p>
            <p className="text-white">Boarding learners: {formatNumber(enrolment.totals.totalBoarding)}</p>
            <p className="pt-2 text-xs font-semibold text-blue-100">Figures as of {enrolment.reportingDateLabel}.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
