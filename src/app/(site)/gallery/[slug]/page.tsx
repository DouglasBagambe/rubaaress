import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GalleryMediaGrid } from "@/components/gallery-media-grid";
import { Section } from "@/components/section";
import { getGalleryAlbumDetail } from "@/sanity/content";

type GalleryAlbumPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string; after?: string; media?: string }>;
};

export async function generateMetadata({ params }: GalleryAlbumPageProps) {
  const { slug } = await params;
  const detail = await getGalleryAlbumDetail({ slug, limit: 1 });
  if (!detail) return {};

  return {
    title: detail.album.seoTitle ?? `${detail.album.title} | Rubaare Secondary School Gallery`,
    description: detail.album.seoDescription ?? detail.album.shortDescription,
    alternates: { canonical: `/gallery/${detail.album.slug}` },
    openGraph: {
      title: detail.album.seoTitle ?? detail.album.title,
      description: detail.album.seoDescription ?? detail.album.shortDescription,
      images: [{ url: detail.album.coverImage.src, alt: detail.album.coverImage.alt }],
    },
  };
}

export default async function GalleryAlbumPage({ params, searchParams }: GalleryAlbumPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const detail = await getGalleryAlbumDetail({ slug, type: query.type, cursor: query.after, limit: 24 });

  if (!detail) {
    notFound();
  }

  const type = query.type === "photos" || query.type === "videos" ? query.type : "all";
  const typeQuery = type === "all" ? "" : `?type=${type}`;
  const loadMoreHref = detail.nextCursor ? `/gallery/${detail.album.slug}?${new URLSearchParams({ ...(type !== "all" ? { type } : {}), after: detail.nextCursor }).toString()}` : undefined;

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Gallery", href: "/gallery" }, { label: detail.album.title, href: `/gallery/${detail.album.slug}` }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold text-[var(--school-gold)]">{detail.album.category}</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--school-blue-dark)] md:text-5xl">{detail.album.title}</h1>
              <p className="mt-5 text-lg leading-8 text-[var(--school-muted)]">{detail.album.introduction ?? detail.album.shortDescription}</p>
              <p className="mt-5 text-sm font-semibold text-[var(--school-blue-dark)]">
                {detail.album.photoCount} photos{detail.album.videoCount ? ` · ${detail.album.videoCount} videos` : ""}
                {detail.album.eventDate ? ` · ${detail.album.eventDate}` : detail.album.academicYear ? ` · ${detail.album.academicYear}` : ""}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/gallery/${detail.album.slug}`} className={`px-4 py-2 text-sm font-bold ${type === "all" ? "bg-[var(--school-blue)] text-white" : "border border-[var(--school-border)] text-[var(--school-blue-dark)]"}`}>
                  All
                </Link>
                {detail.album.photoCount ? (
                  <Link href={`/gallery/${detail.album.slug}?type=photos`} className={`px-4 py-2 text-sm font-bold ${type === "photos" ? "bg-[var(--school-blue)] text-white" : "border border-[var(--school-border)] text-[var(--school-blue-dark)]"}`}>
                    Photos
                  </Link>
                ) : null}
                {detail.album.videoCount ? (
                  <Link href={`/gallery/${detail.album.slug}?type=videos`} className={`px-4 py-2 text-sm font-bold ${type === "videos" ? "bg-[var(--school-blue)] text-white" : "border border-[var(--school-border)] text-[var(--school-blue-dark)]"}`}>
                    Videos
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden bg-[var(--school-blue-dark)]">
              <Image src={(detail.album.bannerImage ?? detail.album.coverImage).src} alt={(detail.album.bannerImage ?? detail.album.coverImage).alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        {detail.media.length ? (
          <>
            <GalleryMediaGrid albumTitle={detail.album.title} media={detail.media} />
            {loadMoreHref ? (
              <div className="mt-8 text-center">
                <Link href={loadMoreHref} className="inline-flex bg-[var(--school-blue)] px-5 py-3 text-sm font-bold text-white">
                  Load more
                </Link>
              </div>
            ) : null}
          </>
        ) : (
          <div className="border border-[var(--school-border)] bg-[var(--school-cream)] p-8">
            <p className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">No media has been published for this album yet.</p>
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--school-border)] pt-6">
          <Link href={`/gallery${typeQuery}`} className="text-sm font-bold text-[var(--school-blue-dark)] underline">
            Back to gallery
          </Link>
          {detail.relatedAlbums.length ? (
            <div className="flex flex-wrap gap-3">
              {detail.relatedAlbums.map((album) => (
                <Link key={album.id} href={`/gallery/${album.slug}`} className="border border-[var(--school-border)] px-4 py-2 text-sm font-semibold text-[var(--school-blue-dark)] hover:border-[var(--school-gold)]">
                  {album.title}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}
