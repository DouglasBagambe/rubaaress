import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { academicPathways, pageIntros } from "@/lib/site-data";
import { getAcademicContent } from "@/sanity/content";

export default async function ALevelPage() {
  const academicContent = await getAcademicContent();
  const pathway = academicContent.programmes.find((item) => item.title.includes("A-Level")) ?? academicPathways[1];
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.academics, eyebrow: "A-Level", title: pathway.title }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "A-Level", href: "/academics/a-level" }]} />
      <TextBlockGrid eyebrow="Pathway" title={pathway.title} description={"summary" in pathway ? pathway.summary : pathway.body} blocks={"highlights" in pathway ? pathway.highlights.map((highlight) => ({ title: highlight, body: "Details will be added as pathway information is confirmed." })) : [{ title: pathway.title, body: pathway.body }]} />
    </>
  );
}
