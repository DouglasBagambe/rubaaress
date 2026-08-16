import type { Metadata } from "next";
import { InteriorHero } from "@/components/interior-page";
import { Section, SectionHeading } from "@/components/section";
import { TemporaryImage } from "@/components/temporary-image";
import { images, pageIntros, schoolIdentity } from "@/lib/site-data";

export const metadata: Metadata = { title: "Headteacher", description: "Meet Ms. Mpeirwe Monic Atukunda, Headteacher of Rubaare Secondary School.", alternates: { canonical: "/about/headteacher" } };

export default function HeadteacherPage() {
  return <><InteriorHero intro={{ ...pageIntros.about, eyebrow: "Headteacher", title: schoolIdentity.headteacher, description: "Headteacher of Rubaare Secondary School." }} breadcrumbs={[{ label: "About", href: "/about" }, { label: "Headteacher", href: "/about/headteacher" }]} /><Section className="bg-[var(--school-cream)]"><div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"><TemporaryImage image={images.headteacher} className="aspect-[3/2]" imgClassName="object-center" sizes="(min-width: 1024px) 58vw, 100vw" priority /><SectionHeading eyebrow="School Leadership" title={schoolIdentity.headteacher} description="Ms. Mpeirwe Monic Atukunda leads Rubaare Secondary School with support from the senior administration, academic leadership, class teachers and hostel leadership teams." /></div></Section></>;
}
