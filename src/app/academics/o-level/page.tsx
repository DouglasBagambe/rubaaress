import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { academicPathways, pageIntros } from "@/lib/site-data";

export default function OLevelPage() {
  const pathway = academicPathways[0];
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.academics, eyebrow: "O-Level", title: pathway.title }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "O-Level", href: "/academics/o-level" }]} />
      <TextBlockGrid eyebrow="Pathway" title={pathway.title} description={pathway.summary} blocks={pathway.highlights.map((highlight) => ({ title: highlight, body: "Details will be added as pathway information is confirmed." }))} />
    </>
  );
}
