import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { InteriorHero } from "@/components/interior-page";
import { Section } from "@/components/section";
import { canonicalSiteUrl } from "@/content/site";
import { pageIntros } from "@/lib/site-data";
import { getNewsArticle } from "@/sanity/content";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const getArticle = cache(getNewsArticle);

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const canonical = `/news/${article.slug}`;
  const title = article.seoTitle ?? article.title;
  const description = article.seoDescription ?? article.excerpt;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: article.publishedAt,
      images: [{ url: article.featuredImage.src, width: article.featuredImage.width, height: article.featuredImage.height, alt: article.featuredImage.alt }],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const canonicalUrl = `${canonicalSiteUrl}/news/${article.slug}`;
  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt,
    mainEntityOfPage: canonicalUrl,
    image: article.featuredImage.src.startsWith("http") ? article.featuredImage.src : `${canonicalSiteUrl}${article.featuredImage.src}`,
    publisher: { "@type": "Organization", name: "Rubaare Secondary School", url: `${canonicalSiteUrl}/` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }} />
      <InteriorHero intro={{ ...pageIntros.news, title: article.title, description: article.excerpt, image: article.featuredImage }} breadcrumbs={[{ label: "News", href: "/news" }, { label: article.title, href: `/news/${article.slug}` }]} />
      <Section className="bg-white">
        <article className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold text-[var(--school-gold)]">
            {article.category}{article.publishedAt ? ` · ${formatDate(article.publishedAt)}` : ""}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--school-blue-dark)]">School update</h2>
          <div className="mt-6 grid gap-5 text-base leading-8 text-[var(--school-ink)]">
            {article.content.split(/\n\s*\n/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {article.circularHref ? (
            <Link href={article.circularHref} target="_blank" className="mt-8 inline-flex min-h-12 items-center bg-[var(--school-blue)] px-6 text-sm font-bold text-white hover:bg-[var(--school-blue-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2">
              Read the full official circular (PDF)
            </Link>
          ) : null}
          <p className="mt-8 border-t border-[var(--school-border)] pt-5 text-sm text-[var(--school-muted)]">Source: {article.author}</p>
        </article>
      </Section>
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Kampala" }).format(new Date(value));
}
