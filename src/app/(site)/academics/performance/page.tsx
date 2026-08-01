import type { Metadata } from "next";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";

export const metadata: Metadata = { title: "Academic Performance", description: "Academic performance information for Rubaare Secondary School." };

export default function PerformancePage() {
  return (
    <>
      <InteriorHero intro={{ ...pageIntros.academics, eyebrow: "Performance", title: "Academic performance." }} breadcrumbs={[{ label: "Academics", href: "/academics" }, { label: "Performance", href: "/academics/performance" }]} />
      <TextBlockGrid eyebrow="Performance" title="Performance summaries." description="Performance information will be published only after school confirmation." blocks={[{ title: "Confirmed results required", body: "No public performance figures have been published yet." }]} />
    </>
  );
}
