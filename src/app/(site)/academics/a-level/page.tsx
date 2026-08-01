import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { academicPathways, pageIntros } from "@/lib/site-data";

export default function ALevelPage() {
  const pathway = academicPathways[1];
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.academics, eyebrow: "A-Level", title: pathway.title }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "A-Level", href: "/academics/a-level" }]} />
      <TextBlockGrid eyebrow="Pathway" title={pathway.title} description={pathway.summary} blocks={pathway.highlights.map((highlight) => ({ title: highlight, body: "Details will be added as pathway information is confirmed." }))} />
    </>
  );
}
