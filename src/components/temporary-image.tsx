import Image from "next/image";
import type { ImageAsset } from "@/lib/site-data";

type TemporaryImageProps = {
  image: ImageAsset;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  showDevelopmentBadge?: boolean;
};

export function TemporaryImage({
  image,
  className = "aspect-[16/10]",
  imgClassName = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  showDevelopmentBadge = false,
}: TemporaryImageProps) {
  return (
    <figure className={`relative overflow-hidden bg-[var(--school-blue-dark)] ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imgClassName}`}
      />
      {showDevelopmentBadge && process.env.NODE_ENV === "development" ? (
        <figcaption className="absolute left-3 top-3 bg-[var(--school-gold)] px-3 py-1 text-xs font-bold text-[var(--school-ink)]">
          Temporary image
        </figcaption>
      ) : null}
    </figure>
  );
}
