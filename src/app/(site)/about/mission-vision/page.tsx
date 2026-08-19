import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros, schoolIdentity } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Mission & Vision",
  description: "The official mission, vision and Rise and Shine motto of Rubaare Secondary School.",
  alternates: { canonical: "/about/mission-vision" },
};

export default function MissionVisionPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.about, eyebrow: "Mission & Vision", title: "Mission, vision and motto." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Mission & Vision", href: "/about/mission-vision" }]} />
      <TextBlockGrid eyebrow="Rise and Shine" title="Mission and vision." description={schoolIdentity.motto} blocks={[{ title: "Mission", body: schoolIdentity.mission }, { title: "Vision", body: schoolIdentity.vision }]} />
    </>
  );
}
