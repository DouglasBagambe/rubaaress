import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export default function AdmissionsPage() {
  return (
    <>
      <InteriorHero intro={pageIntros.admissions} breadcrumbs={[{ label: "Admissions", href: "/admissions" }]} />
      <TextBlockGrid
        eyebrow="Apply"
        title="Admissions information."
        description="Application steps, requirements and downloadable forms are grouped for parents and guardians."
        blocks={[
          { id: "apply", title: "How to Apply", body: "Application steps will be published here once the school confirms the admissions process." },
          { id: "requirements", title: "Admission Requirements", body: "Requirements will be listed clearly for each intake." },
          { id: "documents", title: "Fees & Documents", body: "Fee documents and forms will be downloadable when supplied." },
          { id: "faq", title: "Frequently Asked Questions", body: "Common parent and guardian questions will be answered here." },
        ]}
      />
    </>
  );
}
