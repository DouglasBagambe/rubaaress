import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros, schoolIdentity } from "@/lib/site-data";

export default function MissionVisionPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.about, eyebrow: "Mission & Vision", title: "Mission, vision and motto." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Mission & Vision", href: "/about/mission-vision" }]} />
      <TextBlockGrid eyebrow="Rise and Shine" title="Mission and vision." description={schoolIdentity.motto} blocks={[{ title: "Mission", body: schoolIdentity.mission }, { title: "Vision", body: schoolIdentity.vision }]} />
    </>
  );
}
