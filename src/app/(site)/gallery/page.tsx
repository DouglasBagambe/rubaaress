import Image from "next/image";
import { InteriorHero } from "@/components/interior-page";
import { Section, SectionHeading } from "@/components/section";
import { pageIntros } from "@/lib/site-data";
import { getGalleryIndex } from "@/sanity/content";
import Link from "next/link";

type GalleryPageProps = {
  searchParams: Promise<{ category?: string; year?: string; type?: string; search?: string }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const gallery = await getGalleryIndex(params);

  return (
    <>
      <InteriorHero intro={pageIntros.gallery} breadcrumbs={[{ label: "Gallery", href: "/gallery" }]} />
      <Section className="bg-white">
        <SectionHeading
          eyebrow="Albums"
          title="Official school gallery albums."
          description="Photos and videos are grouped into albums so visitors can explore school life without loading every media item at once."
        />

        {gallery.featuredAlbum ? (
          <article className="mt-10 grid overflow-hidden border border-[var(--school-border)] bg-[var(--school-blue-dark)] text-white lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[320px]">
              <Image src={gallery.featuredAlbum.coverImage.src} alt={gallery.featuredAlbum.coverImage.alt} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-8">
              <p className="text-sm font-semibold text-[var(--school-gold)]">{gallery.featuredAlbum.category}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold">{gallery.featuredAlbum.title}</h2>
              <p className="mt-4 leading-7 text-white/80">{gallery.featuredAlbum.shortDescription}</p>
              <p className="mt-5 text-sm text-white/75">
                {gallery.featuredAlbum.photoCount} photos{gallery.featuredAlbum.videoCount ? ` · ${gallery.featuredAlbum.videoCount} videos` : ""}
              </p>
              <Link href={`/gallery/${gallery.featuredAlbum.slug}`} className="mt-6 w-fit bg-[var(--school-gold)] px-5 py-3 text-sm font-bold text-[var(--school-ink)]">
                View Album
              </Link>
            </div>
          </article>
        ) : null}

        <form className="mt-8 flex flex-wrap items-end gap-3 border border-[var(--school-border)] bg-[var(--school-cream)] p-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
            Search
            <input name="search" defaultValue={gallery.search} className="min-h-11 border border-[var(--school-border)] bg-white px-3 font-normal" placeholder="Album title" />
          </label>
          {gallery.categories.length ? (
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
              Category
              <select name="category" defaultValue={gallery.selectedCategory} className="min-h-11 border border-[var(--school-border)] bg-white px-3 font-normal">
                <option value="">All</option>
                {gallery.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {gallery.academicYears.length ? (
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
              Year
              <select name="year" defaultValue={gallery.selectedYear} className="min-h-11 border border-[var(--school-border)] bg-white px-3 font-normal">
                <option value="">All</option>
                {gallery.academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {(gallery.hasPhotos || gallery.hasVideos) ? (
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
              Type
              <select name="type" defaultValue={gallery.selectedType} className="min-h-11 border border-[var(--school-border)] bg-white px-3 font-normal">
                <option value="all">All</option>
                {gallery.hasPhotos ? <option value="photos">Photos</option> : null}
                {gallery.hasVideos ? <option value="videos">Videos</option> : null}
              </select>
            </label>
          ) : null}
          <button type="submit" className="min-h-11 bg-[var(--school-blue)] px-5 text-sm font-bold text-white">
            Apply
          </button>
          <Link href="/gallery" className="flex min-h-11 items-center px-3 text-sm font-semibold text-[var(--school-blue-dark)] underline">
            Clear
          </Link>
        </form>

        {gallery.albums.length === 0 ? (
          <div className="mt-10 border border-[var(--school-border)] bg-[var(--school-cream)] p-8">
            <p className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">No gallery albums have been published yet.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.albums.map((album) => (
              <Link key={album.id} href={`/gallery/${album.slug}`} className="group border border-[var(--school-border)] bg-white hover:border-[var(--school-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2">
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--school-blue-dark)]">
                  <Image src={album.coverImage.src} alt={album.coverImage.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-[var(--school-gold)]">{album.category}</p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">{album.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--school-muted)]">
                    {album.photoCount} photos{album.videoCount ? ` · ${album.videoCount} videos` : ""}
                    {album.academicYear ? ` · ${album.academicYear}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 border-l-4 border-[var(--school-gold)] bg-[var(--school-cream)] p-6">
          <p className="font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">See school life beyond the classroom.</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--school-muted)]">Explore student life, admissions and academic pathways alongside the official gallery.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/school-life" className="bg-[var(--school-blue)] px-5 py-3 text-sm font-bold text-white">
              School Life
            </Link>
            <Link href="/admissions" className="border border-[var(--school-blue)] px-5 py-3 text-sm font-bold text-[var(--school-blue-dark)]">
              Admissions
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
