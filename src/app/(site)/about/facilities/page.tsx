import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "School Facilities", description: "Verified utilities and campus services at Rubaare Secondary School.", alternates: { canonical: "/about/facilities" } };

export default function FacilitiesPage() {
  return <><InteriorHero intro={{ ...pageIntros.about, eyebrow: "Facilities", title: "A supported learning environment.", description: "Official school admission material confirms the utilities available on campus." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Facilities", href: "/about/facilities" }]} /><TextBlockGrid eyebrow="Campus Utilities" title="Essential services at school." description="Rubaare Secondary School has the following confirmed campus utilities." blocks={[{ title: "Electricity", body: "The school is connected to electricity." }, { title: "Standby Generator", body: "A standby generator supports the school's power provision." }, { title: "Solar Power", body: "Solar power is available at the school." }, { title: "Clean Water", body: "The school provides clean water." }]} /></>;
}
