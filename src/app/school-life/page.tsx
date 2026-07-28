import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros, schoolLife } from "@/lib/site-data";

export default function SchoolLifePage() {
  return (
    <>
      <InteriorHero intro={pageIntros.schoolLife} breadcrumbs={[{ label: "School Life", href: "/school-life" }]} />
      <TextBlockGrid
        eyebrow="Student Formation"
        title="Life at school."
        description="Clubs, sports, faith, leadership and community life are grouped for easy browsing."
        blocks={schoolLife.map((item) => ({
          id: item.href.split("#")[1],
          title: item.title,
          body: item.summary,
        }))}
      />
    </>
  );
}
