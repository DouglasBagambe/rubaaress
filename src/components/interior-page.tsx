import Link from "next/link";
import { Breadcrumbs, type Breadcrumb } from "@/components/breadcrumbs";
import { Section, SectionHeading } from "@/components/section";
import { TemporaryImage } from "@/components/temporary-image";
import type { PageIntro } from "@/lib/site-data";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2";

type InteriorHeroProps = {
  intro: PageIntro;
  breadcrumbs: ReadonlyArray<Breadcrumb>;
};

type TextBlock = {
  id?: string;
  title: string;
  body: string;
  href?: string;
};

type ListingItem = {
  title: string;
  meta?: string;
  summary: string;
  href?: string;
};

export function InteriorHero({ intro, breadcrumbs }: InteriorHeroProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <Breadcrumbs items={breadcrumbs} />
          <p className="mb-3 text-sm font-semibold text-[var(--school-gold)]">{intro.eyebrow}</p>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-[var(--school-blue-dark)] md:text-5xl">
            {intro.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--school-muted)]">{intro.description}</p>
        </div>
        <TemporaryImage image={intro.image} className="aspect-[16/8] lg:aspect-[16/9]" priority />
      </div>
    </section>
  );
}

export function TextBlockGrid({
  eyebrow,
  title,
  description,
  blocks,
}: {
  eyebrow: string;
  title: string;
  description: string;
  blocks: ReadonlyArray<TextBlock>;
}) {
  return (
    <Section className="bg-[var(--school-cream)]">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {blocks.map((block) => {
          const content = (
            <>
              <h2 className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">{block.title}</h2>
              <p className="mt-4 text-base leading-7 text-[var(--school-muted)]">{block.body}</p>
            </>
          );

          if (block.href) {
            return (
              <Link key={block.title} id={block.id} href={block.href} className={`border border-[var(--school-border)] bg-white p-6 hover:border-[var(--school-gold)] ${focusClass}`}>
                {content}
              </Link>
            );
          }

          return (
            <article key={block.title} id={block.id} className="border border-[var(--school-border)] bg-white p-6">
              {content}
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function ListingSection({
  eyebrow,
  title,
  description,
  items,
  emptyMessage,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: ReadonlyArray<ListingItem>;
  emptyMessage?: string;
}) {
  return (
    <Section className="bg-white">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      {items.length === 0 ? (
        <div className="mt-10 border border-[var(--school-border)] bg-[var(--school-cream)] p-8">
          <p className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">{emptyMessage ?? "Nothing has been published yet."}</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item) => {
            const content = (
              <>
                {item.meta ? <p className="text-sm font-semibold text-[var(--school-gold)]">{item.meta}</p> : null}
                <h2 className="mt-3 font-serif text-xl font-semibold text-[var(--school-blue-dark)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--school-muted)]">{item.summary}</p>
              </>
            );

            if (item.href) {
              return (
                <Link key={item.title} href={item.href} className={`border border-[var(--school-border)] bg-white p-5 hover:border-[var(--school-gold)] ${focusClass}`}>
                  {content}
                </Link>
              );
            }

            return (
              <article key={item.title} className="border border-[var(--school-border)] bg-white p-5">
                {content}
              </article>
            );
          })}
        </div>
      )}
    </Section>
  );
}
