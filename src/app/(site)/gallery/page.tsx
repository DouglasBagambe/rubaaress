import { InteriorHero } from "@/components/interior-page";
import { Section, SectionHeading } from "@/components/section";
import { TemporaryImage } from "@/components/temporary-image";
import { galleryAlbums, pageIntros } from "@/lib/site-data";

export default function GalleryPage() {
  return (
    <>
      <InteriorHero intro={pageIntros.gallery} breadcrumbs={[{ label: "Gallery", href: "/gallery" }]} />
      <Section className="bg-white">
        <SectionHeading
          eyebrow="Albums"
          title="School gallery albums."
          description="Official images are grouped by content area so visitors can scan the collection without loading every image at once."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryAlbums.map((album) => (
            <article key={album.slug} className="border border-[var(--school-border)] bg-white">
              <TemporaryImage image={album.coverImage} className="aspect-[4/3]" />
              <div className="p-5">
                <p className="text-sm font-semibold text-[var(--school-gold)]">{album.images.length} images</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-[var(--school-blue-dark)]">{album.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--school-muted)]">{album.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
