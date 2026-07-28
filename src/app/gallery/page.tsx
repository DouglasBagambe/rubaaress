import { InteriorHero } from "@/components/interior-page";
import { Section, SectionHeading } from "@/components/section";
import { TemporaryImage } from "@/components/temporary-image";
import { galleryImages, pageIntros } from "@/lib/site-data";

export default function GalleryPage() {
  return (
    <>
      <InteriorHero intro={pageIntros.gallery} breadcrumbs={[{ label: "Gallery", href: "/gallery" }]} />
      <Section className="bg-white">
        <SectionHeading
          eyebrow="Albums"
          title="School gallery."
          description="Albums are ready for campus, classroom, sports and activity photography."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((image) => (
            <TemporaryImage key={image.src} image={image} className="aspect-[4/3]" />
          ))}
        </div>
      </Section>
    </>
  );
}
