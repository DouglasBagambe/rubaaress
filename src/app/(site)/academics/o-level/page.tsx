import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { academicPathways, pageIntros } from "@/lib/site-data";
import { getAcademicContent } from "@/sanity/content";

export default async function OLevelPage() {
  const academicContent = await getAcademicContent();
  const pathway = academicContent.programmes.find((item) => item.title.includes("O-Level")) ?? academicPathways[0];
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.academics, eyebrow: "O-Level", title: pathway.title }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "O-Level", href: "/academics/o-level" }]} />
      <TextBlockGrid eyebrow="Pathway" title={pathway.title} description={"summary" in pathway ? pathway.summary : pathway.body} blocks={"highlights" in pathway ? pathway.highlights.map((highlight) => ({ title: highlight, body: "Details will be added as pathway information is confirmed." })) : [{ title: pathway.title, body: pathway.body }]} />
    </>
  );
}
