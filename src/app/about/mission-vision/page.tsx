import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export default function MissionVisionPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.about, eyebrow: "Mission, Vision & Values", title: "Mission, vision and values." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Mission, Vision & Values", href: "/about/mission-vision" }]} />
      <TextBlockGrid eyebrow="Values" title="Approved statements will appear here." description="This page is ready for the school mission, vision and value statements." blocks={[{ title: "Mission", body: "Mission statement to be added after approval." }, { title: "Vision", body: "Vision statement to be added after approval." }]} />
    </>
  );
}
