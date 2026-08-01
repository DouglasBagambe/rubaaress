import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export default function HistoryPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.about, eyebrow: "School History", title: "School history and institutional background." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "School History", href: "/about/history" }]} />
      <TextBlockGrid eyebrow="History" title="A focused history page." description="Founding dates and milestones will be added after school confirmation." blocks={[{ title: "Institutional Background", body: "Rubaare Secondary School is located in Rubaare, Ntungamo District, Uganda." }]} />
    </>
  );
}
