import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getAcademicContent } from "@/sanity/content";

export default async function DepartmentsPage() {
  const academicContent = await getAcademicContent();
  const blocks = academicContent.departments.length
    ? academicContent.departments
    : [{ title: "Departments", body: "Department information will be added after confirmation." }];

  return (
    <>
      <InteriorHero intro={{ ...pageIntros.academics, eyebrow: "Departments", title: "Academic departments." }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "Departments", href: "/academics/departments" }]} />
      <TextBlockGrid eyebrow="Departments" title="Subject departments." description="Department pages can expand as subject leadership and curriculum information are confirmed." blocks={blocks} />
    </>
  );
}
