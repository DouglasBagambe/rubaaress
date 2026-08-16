import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros, schoolLife } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "School Life",
  description: "Sports, day and boarding student life, and the Church of Uganda foundation of Rubaare Secondary School.",
  alternates: { canonical: "/school-life" },
};

export default function SchoolLifePage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.schoolLife, description: "Day and boarding learners share academic, sporting, faith and community life at Rubaare Secondary School." }} breadcrumbs={[{ label: "School Life", href: "/school-life" }]} />
      <TextBlockGrid
        eyebrow="Student Experience"
        title="Life at Rubaare Secondary School."
        description="The school brings together classroom learning and shared responsibilities beyond lessons."
        blocks={schoolLife.map((item) => ({ id: item.href.split("#")[1], title: item.title, body: item.summary }))}
      />
    </>
  );
}
