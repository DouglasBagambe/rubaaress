import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export default function AboutPage() {
  return (
    <>
      <InteriorHero intro={pageIntros.about} breadcrumbs={[{ label: "About", href: "/about" }]} />
      <TextBlockGrid
        eyebrow="School Profile"
        title="School profile sections."
        description="The about section introduces the school profile and directs visitors to focused pages."
        blocks={[
          { title: "School History", body: "A dedicated history page is ready for confirmed founding details and milestones.", href: "/about/history" },
          { title: "Mission, Vision & Values", body: "Mission and vision content has a dedicated page for publication after approval.", href: "/about/mission-vision" },
          { title: "Leadership", body: "Leadership profiles include the headteacher and school administration structure.", href: "/about/leadership" },
          { title: "Facilities", body: "Campus and facilities information will expand as school photography and descriptions are supplied." },
        ]}
      />
    </>
  );
}
