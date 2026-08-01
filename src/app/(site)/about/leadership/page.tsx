import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getStaff } from "@/sanity/content";

export default async function LeadershipPage() {
  const staff = await getStaff();

  return (
    <>
      <InteriorHero intro={{ ...pageIntros.about, eyebrow: "Leadership", title: "School leadership." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Leadership", href: "/about/leadership" }]} />
      <TextBlockGrid eyebrow="Administration" title="Leadership structure." description="Leadership profiles can be expanded with approved portraits and biographies." blocks={staff} />
    </>
  );
}
