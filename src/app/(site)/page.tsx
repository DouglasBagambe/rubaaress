import Link from "next/link";
import { FullWidthHero } from "@/components/full-width-hero";
import { LocationSection } from "@/components/location-section";
import { Section, SectionHeading } from "@/components/section";
import { TemporaryImage } from "@/components/temporary-image";
import { academicResults } from "@/content/verified-school-content";
import { websiteStructuredData } from "@/content/site";
import {
  academicPathways,
  galleryImages,
  schoolLife,
} from "@/lib/site-data";
import { getCurrentEnrolment, getEvents, getHomepage, getNewsArticles, getSiteSettings } from "@/sanity/content";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2";

export default async function Home() {
  const [settings, homepage, enrolment, latestNews, events] = await Promise.all([getSiteSettings(), getHomepage(), getCurrentEnrolment(), getNewsArticles(), getEvents()]);
  const upcomingEvents = events.upcoming;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }} />
      <FullWidthHero slides={homepage.heroSlides} />

      <section className="bg-white py-6">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 md:grid-cols-4 md:px-6 lg:px-8">
          {homepage.quickAccessLinks.map((item) => (
            <Link key={item.href} href={item.href} className={`group border-l-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5 hover:bg-white hover:shadow-sm ${focusClass}`}>
              <span className="block font-serif text-xl font-semibold text-[var(--school-blue-dark)]">{item.label}</span>
              <span className="mt-2 block text-sm leading-6 text-[var(--school-muted)]">{item.description}</span>
              <span className="mt-4 block text-sm font-bold text-[var(--school-blue)] group-hover:translate-x-1 motion-reduce:transform-none">View section</span>
            </Link>
          ))}
        </div>
      </section>

      <Section className="bg-[var(--school-cream)]">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow={homepage.welcome.eyebrow}
            title={homepage.welcome.heading}
            description={homepage.welcome.introduction}
          />
          <div className="border-l-4 border-[var(--school-gold)] bg-white p-7 text-lg leading-8 text-[var(--school-ink)]">
            {homepage.welcome.body}
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            eyebrow="Academic Performance"
            title="Official UCE and UACE results."
            description="The 2025 school results summary records 257 learners in UCE Result 1 and a UACE points distribution covering 132 learners."
          />
          <Link href="/academics/performance" className={`inline-flex min-h-12 items-center justify-center bg-[var(--school-blue)] px-6 text-sm font-bold text-white hover:bg-[var(--school-blue-dark)] ${focusClass}`}>
            View academic performance
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border-t-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5"><p className="font-serif text-4xl font-semibold text-[var(--school-blue-dark)]">{academicResults.uce.classifications[0].result1}</p><p className="mt-2 font-bold">UCE Result 1</p></div>
          <div className="border-t-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5"><p className="font-serif text-4xl font-semibold text-[var(--school-blue-dark)]">{academicResults.uace2025.universityQualified}</p><p className="mt-2 font-bold">Qualify for University Education</p></div>
          <div className="border-t-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-5"><p className="font-serif text-4xl font-semibold text-[var(--school-blue-dark)]">{academicResults.uace2025.diplomaQualified}</p><p className="mt-2 font-bold">Qualify for Diploma</p></div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <TemporaryImage image={homepage.headteacher.image} className="aspect-[3/2]" imgClassName="object-center" sizes="(min-width: 1024px) 44vw, 100vw" />
          <div>
            <SectionHeading
              eyebrow={homepage.headteacher.eyebrow}
              title={homepage.headteacher.name}
              description={homepage.headteacher.message}
            />
            <Link href={homepage.headteacher.ctaHref} className={`mt-7 inline-flex min-h-12 items-center bg-[var(--school-blue)] px-6 text-sm font-bold text-white hover:bg-[var(--school-blue-dark)] ${focusClass}`}>
              {homepage.headteacher.ctaLabel}
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <TemporaryImage image={homepage.masterPlanPreview.image} className="aspect-[16/10]" priority={false} />
          <div>
            <SectionHeading
              eyebrow={homepage.masterPlanPreview.eyebrow}
              title={homepage.masterPlanPreview.title}
              description={homepage.masterPlanPreview.description}
            />
            <Link href={homepage.masterPlanPreview.ctaHref} className={`mt-7 inline-flex min-h-12 items-center bg-[var(--school-blue)] px-6 text-sm font-bold text-white hover:bg-[var(--school-blue-dark)] ${focusClass}`}>
              {homepage.masterPlanPreview.ctaLabel}
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-[var(--school-cream)]">
        <SectionHeading eyebrow="Academics" title="O-Level and A-Level pathways." description={homepage.academicsIntroduction} />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {academicPathways.map((pathway) => (
            <article key={pathway.title} className="border border-[var(--school-border)] bg-white p-6">
              <h3 className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">{pathway.title}</h3>
              <p className="mt-4 text-base leading-7 text-[var(--school-muted)]">{pathway.summary}</p>
              <ul className="mt-6 grid gap-3 text-sm font-medium text-[var(--school-ink)]">
                {pathway.highlights.map((highlight) => <li key={highlight} className="border-t border-[var(--school-border)] pt-3">{highlight}</li>)}
              </ul>
              <Link href={pathway.href} className={`mt-6 inline-flex min-h-11 items-center border border-[var(--school-blue)] px-5 text-sm font-bold text-[var(--school-blue)] hover:bg-[var(--school-blue)] hover:text-white ${focusClass}`}>
                View pathway
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-[var(--school-blue-dark)] text-white">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--school-gold)]">{enrolment.academicYear} School Enrolment</p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-white md:text-4xl">{homepage.enrolmentSectionHeading}</h2>
          <p className="mt-4 text-base leading-7 text-blue-100 md:text-lg">Enrolment figures as of {enrolment.reportingDateLabel}.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {enrolment.stats.map((stat) => (
            <div key={stat.label} className="border-t-4 border-[var(--school-gold)] bg-white/10 p-5">
              <p className="font-serif text-4xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 font-bold text-white">{stat.label}</p>
              <p className="mt-2 text-sm leading-6 text-blue-100">{stat.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {latestNews.length || upcomingEvents.length ? (
        <Section className="bg-white">
          <div className={`grid gap-12 ${latestNews.length && upcomingEvents.length ? "lg:grid-cols-2" : "max-w-3xl"}`}>
            {latestNews.length ? <ContentList title={homepage.latestNewsHeading} items={latestNews.slice(0, 3).map((item) => ({ title: item.title, href: `/news/${item.slug}`, meta: item.category, summary: item.excerpt }))} href="/news" /> : null}
            {upcomingEvents.length ? <ContentList title={homepage.eventsHeading} items={upcomingEvents.slice(0, 3).map((item) => ({ title: item.title, href: "/events", meta: formatEventDate(item.startDate, item.endDate), summary: item.description }))} href="/events" /> : null}
          </div>
        </Section>
      ) : null}

      <Section className="bg-[var(--school-cream)]">
        <SectionHeading eyebrow="School Life" title="Learning beyond the classroom." description={homepage.schoolLifeFeature} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {schoolLife.map((item) => (
            <Link key={item.title} href={item.href} className={`group bg-white ${focusClass}`}>
              <TemporaryImage image={item.image} className="aspect-[16/10]" />
              <span className="block p-5">
                <span className="block font-serif text-xl font-semibold text-[var(--school-blue-dark)]">{item.title}</span>
                <span className="mt-2 block text-sm leading-6 text-[var(--school-muted)]">{item.summary}</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeading eyebrow="Gallery" title="A visual introduction to school life." description="Official Rubaare Secondary School photography is organised across campus, academics, sports, student life and development albums." />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {galleryImages.map((image) => <TemporaryImage key={image.src} image={image} className="aspect-[4/3]" />)}
        </div>
        <Link href="/gallery" className={`mt-8 inline-flex min-h-12 items-center border border-[var(--school-blue)] px-6 text-sm font-bold text-[var(--school-blue)] hover:bg-[var(--school-blue)] hover:text-white ${focusClass}`}>
          View Full Gallery
        </Link>
      </Section>

      <section className="bg-[var(--school-blue-dark)] py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[var(--school-gold)]">{homepage.admissionsCta.eyebrow}</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
              {homepage.admissionsCta.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-blue-100">
              {homepage.admissionsCta.description}
            </p>
          </div>
          <Link href={homepage.admissionsCta.href} className="flex min-h-12 items-center justify-center bg-[var(--school-gold)] px-6 text-sm font-bold text-[var(--school-ink)] hover:bg-[#e1ad58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--school-blue-dark)]">
            {homepage.admissionsCta.label}
          </Link>
        </div>
      </section>

      <LocationSection settings={settings} introduction={homepage.locationIntroduction} />
    </>
  );
}

function formatEventDate(startDate?: string, endDate?: string) {
  if (!startDate) return "Confirmed date";
  const formatter = new Intl.DateTimeFormat("en-UG", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Kampala" });
  const start = formatter.format(new Date(`${startDate.slice(0, 10)}T12:00:00Z`));
  if (!endDate) return start;
  return `${start} – ${formatter.format(new Date(`${endDate.slice(0, 10)}T12:00:00Z`))}`;
}

function ContentList({
  title,
  items,
  href,
}: {
  title: string;
  items: ReadonlyArray<{ title: string; href: string; meta: string; summary: string }>;
  href: string;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-serif text-3xl font-semibold text-[var(--school-blue-dark)]">{title}</h2>
        <Link href={href} className={`text-sm font-bold text-[var(--school-blue)] underline underline-offset-4 ${focusClass}`}>View all</Link>
      </div>
      <div className="mt-8 grid gap-4">
        {items.map((item) => (
            <Link key={item.title} href={item.href} className={`block border border-[var(--school-border)] bg-white p-5 hover:border-[var(--school-gold)] ${focusClass}`}>
              <p className="text-sm font-semibold text-[var(--school-gold)]">{item.meta}</p>
              <h3 className="mt-3 font-serif text-xl font-semibold text-[var(--school-blue-dark)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--school-muted)]">{item.summary}</p>
            </Link>
        ))}
      </div>
    </div>
  );
}
