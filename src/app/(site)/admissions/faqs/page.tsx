import type { Metadata } from "next";
import { InteriorHero } from "@/components/interior-page";
import { Section, SectionHeading } from "@/components/section";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Admissions FAQs", description: "Answers to common questions supported by Rubaare Secondary School's official admission documents.", alternates: { canonical: "/admissions/faqs" } };
const faqs = [
  ["Does the school offer day and boarding?", "Yes. Rubaare Secondary School offers day and boarding programmes at O-Level and A-Level."],
  ["Do day students take lunch at school?", "Yes. The admission letters state that day students are expected to have lunch at school."],
  ["What is the main school diet?", "The school diet is mainly posho and beans. The O-Level letter states that matooke may sometimes be served and that no special diet is provided."],
  ["What time should a new student report?", "Official reporting hours are 08:00am–5:00pm. The letters state that a student who does not report within the first week may lose the vacancy to someone on the waiting list."],
  ["What documents should an O-Level entrant bring?", "A recommendation and result slip from the former school, together with the forms and photographs listed in the O-Level pack."],
  ["What documents should an A-Level entrant bring?", "A pass slip or original and photocopy, a recommendation from the former school, and an identity card."],
  ["What utilities are available at school?", "The official O-Level admission material confirms electricity, a standby generator, solar power and clean water."],
  ["How are school fees paid?", "The official fee schedules state that fees are paid through the phone using Sure Pay, with a UGX 2,000 bank charge on each part payment."],
  ["Where can I get the official forms and requirements?", "All approved admission packs, letters, forms, fees, rules and requirements are available on the Downloads page."],
] as const;

export default function FaqPage() {
  return <><InteriorHero intro={{ ...pageIntros.admissions, eyebrow: "FAQs", title: "Admissions questions and answers.", description: "Answers below come directly from the official O-Level and A-Level admission documents." }} breadcrumbs={[{ label: "Admissions", href: "/admissions" }, { label: "FAQs", href: "/admissions/faqs" }]} /><Section className="bg-[var(--school-cream)]"><SectionHeading eyebrow="Admissions FAQs" title="What families need to know." description="For complete requirements, use the official admission packs in the Downloads section." /><div className="mt-8 grid gap-4">{faqs.map(([question, answer]) => <details key={question} className="group bg-white p-5"><summary className="cursor-pointer font-serif text-xl font-semibold text-[var(--school-blue-dark)]">{question}</summary><p className="mt-4 leading-7 text-[var(--school-muted)]">{answer}</p></details>)}</div></Section></>;
}
