import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export default function DepartmentsPage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.academics, eyebrow: "Departments", title: "Academic departments." }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "Departments", href: "/academics/departments" }]} />
      <TextBlockGrid eyebrow="Departments" title="Subject departments." description="Department pages can expand as subject leadership and curriculum information are confirmed." blocks={[{ title: "Sciences", body: "Department information will be added after confirmation." }, { title: "Humanities", body: "Department information will be added after confirmation." }, { title: "Languages", body: "Department information will be added after confirmation." }, { title: "Vocational Subjects", body: "Department information will be added after confirmation." }]} />
    </>
  );
}
