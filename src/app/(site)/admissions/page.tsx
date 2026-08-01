import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getAdmissions } from "@/sanity/content";

export default async function AdmissionsPage() {
  const admissions = await getAdmissions();

  return (
    <>
      <InteriorHero intro={pageIntros.admissions} breadcrumbs={[{ label: "Admissions", href: "/admissions" }]} />
      <TextBlockGrid
        eyebrow="Apply"
        title="Admissions information."
        description={admissions.introduction}
        blocks={admissions.blocks}
      />
    </>
  );
}
