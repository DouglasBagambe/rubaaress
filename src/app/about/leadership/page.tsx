import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros, schoolIdentity } from "@/lib/site-data";

export default function LeadershipPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.about, eyebrow: "Leadership", title: "School leadership." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Leadership", href: "/about/leadership" }]} />
      <TextBlockGrid eyebrow="Administration" title="Leadership structure." description="Leadership profiles can be expanded with approved portraits and biographies." blocks={[{ title: "Headteacher", body: schoolIdentity.headteacher }, { title: "Administration", body: "Additional leadership profiles will be added after confirmation." }]} />
    </>
  );
}
