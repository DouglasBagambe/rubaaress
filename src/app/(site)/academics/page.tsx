import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getAcademicContent } from "@/sanity/content";

export default async function AcademicsPage() {
  const academicContent = await getAcademicContent();

  return (
    <>
      <InteriorHero intro={pageIntros.academics} breadcrumbs={[{ label: "Academics", href: "/academics" }]} />
      <TextBlockGrid
        eyebrow="Academic Structure"
        title="Pathways and departments."
        description="Academic information is organised by pathway, department and learner support."
        blocks={[
          ...academicContent.programmes,
          { id: "departments", title: "Departments", body: "Departments are grouped for clear subject guidance.", href: "/academics/departments" },
          { id: "performance", title: "Academic Performance", body: "Performance summaries can be added after school confirmation." },
        ]}
      />
    </>
  );
}
