import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros, schoolIdentity } from "@/lib/site-data";

export default function MissionVisionPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.about, eyebrow: "Mission, Vision & Values", title: "Mission, vision and values." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Mission, Vision & Values", href: "/about/mission-vision" }]} />
      <TextBlockGrid eyebrow="Values" title="Mission, vision and values." description={schoolIdentity.motto} blocks={[{ title: "Mission", body: schoolIdentity.mission }, { title: "Vision", body: schoolIdentity.vision }]} />
    </>
  );
}
