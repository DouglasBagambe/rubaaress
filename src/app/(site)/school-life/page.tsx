import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getSchoolLifeActivities } from "@/sanity/content";

export default async function SchoolLifePage() {
  const activities = await getSchoolLifeActivities();

  return (
    <>
      <InteriorHero intro={pageIntros.schoolLife} breadcrumbs={[{ label: "School Life", href: "/school-life" }]} />
      <TextBlockGrid
        eyebrow="Student Formation"
        title="Life at school."
        description="Clubs, sports, faith, leadership and community life are grouped for easy browsing."
        blocks={activities}
      />
    </>
  );
}
