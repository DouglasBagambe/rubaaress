import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "School Facilities", description: "Verified utilities, learning facilities and boarding structures at Rubaare Secondary School.", alternates: { canonical: "/about/facilities" } };

export default function FacilitiesPage() {
  return <><InteriorHero intro={{ ...pageIntros.about, eyebrow: "Facilities", title: "A supported learning environment.", description: "Official school material records essential utilities, learning spaces and boarding structures on campus." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Facilities", href: "/about/facilities" }]} /><TextBlockGrid eyebrow="Campus Facilities" title="Learning and daily life at school." description="The following facilities and services are supported by official school documents and photography." blocks={[{ title: "Electricity", body: "The school is connected to electricity." }, { title: "Standby Generator", body: "A standby generator supports the school's power provision." }, { title: "Solar Power", body: "Solar power is available at the school." }, { title: "Clean Water", body: "The school provides clean water, supported by its documented water project." }, { title: "Computer Laboratory", body: "Official school photography records a computer laboratory used by learners." }, { title: "Boarding Structures", body: "Official structure records identify boys' and girls' dormitory buildings and dormitory-area sanitation facilities." }, { title: "Staff Accommodation", body: "The school structure record includes junior staff quarters and headteacher accommodation." }]} /></>;
}
