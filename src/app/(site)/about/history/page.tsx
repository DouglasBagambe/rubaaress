import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { officialAboutPreamble } from "@/content/verified-school-content";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "School History", description: "The verified institutional history of Rubaare Secondary School in Ntungamo District.", alternates: { canonical: "/about/history" } };

export default function HistoryPage() {
  return <><InteriorHero intro={{ ...pageIntros.about, eyebrow: "School History", title: "Our institutional history.", description: officialAboutPreamble[0] }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "School History", href: "/about/history" }]} /><TextBlockGrid eyebrow="History" title="From a girls' school to a mixed secondary school." description={officialAboutPreamble[1]} blocks={[{ title: "Church of Uganda Foundation", body: "Rubaare Secondary School was founded by the Church of Uganda and welcomes students from all religious backgrounds." }, { title: "Education Today", body: "The school serves boys and girls through O-Level and A-Level education, with day and boarding programmes across Arts and Sciences." }]} /></>;
}
