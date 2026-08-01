import { notFound } from "next/navigation";
import { InteriorHero, TextBlockGrid } from "@/components/interior-page";
import { pageIntros } from "@/lib/site-data";
import { getNewsArticle } from "@/sanity/content";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <InteriorHero intro={{ ...pageIntros.news, title: article.title, description: article.excerpt, image: article.featuredImage }} breadcrumbs={[{ label: "News", href: "/news" }, { label: article.title, href: `/news/${article.slug}` }]} />
      <TextBlockGrid eyebrow={article.category} title={article.title} description={article.excerpt} blocks={[{ title: "Story", body: article.content }, { title: "Source", body: article.author }]} />
    </>
  );
}
