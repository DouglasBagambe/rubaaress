"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import type { ResolvedGalleryMedia } from "@/sanity/types";

type GalleryMediaGridProps = {
  albumTitle: string;
  media: ReadonlyArray<ResolvedGalleryMedia>;
};

export function GalleryMediaGrid({ albumTitle, media }: GalleryMediaGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const selectedId = searchParams.get("media");
  const selectedIndex = useMemo(() => media.findIndex((item) => item.id === selectedId), [media, selectedId]);
  const selected = selectedIndex >= 0 ? media[selectedIndex] : undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!selected) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") openByIndex(selectedIndex - 1);
      if (event.key === "ArrowRight") openByIndex(selectedIndex + 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function paramsWithMedia(id: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("media", id);
    else params.delete("media");
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function openByIndex(index: number) {
    const next = media[index];
    if (!next) return;
    router.push(paramsWithMedia(next.id), { scroll: false });
  }

  function closeLightbox() {
    dialogRef.current?.querySelectorAll("video").forEach((video) => video.pause());
    router.push(paramsWithMedia(null), { scroll: false });
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item, index) => {
          const image = item.mediaType === "image" ? item.image : item.posterImage;
          if (!image) return null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => openByIndex(index)}
              className="group relative aspect-[4/3] overflow-hidden border border-[var(--school-border)] bg-[var(--school-blue-dark)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2"
            >
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-semibold text-white">
                {item.mediaType === "video" ? "Video" : item.caption ? item.caption : item.title}
              </span>
            </button>
          );
        })}
      </div>

      <dialog ref={dialogRef} aria-label={`${albumTitle} media viewer`} onClose={closeLightbox} className="w-[min(1100px,calc(100vw-24px))] max-w-none bg-transparent p-0 backdrop:bg-black/80">
        {selected ? (
          <div className="bg-[var(--school-blue-dark)] text-white">
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--school-gold)]">{albumTitle}</p>
                <p className="text-sm text-white/80">
                  {selectedIndex + 1} of {media.length}
                </p>
              </div>
              <button type="button" onClick={closeLightbox} className="border border-white/30 px-3 py-2 text-sm font-semibold hover:bg-white hover:text-[var(--school-blue-dark)]">
                Close
              </button>
            </div>
            <div className="relative bg-black">
              {selected.mediaType === "image" && selected.image ? (
                <div className="relative h-[70vh]">
                  <Image src={selected.image.src} alt={selected.image.alt} fill sizes="100vw" className="object-contain" priority />
                </div>
              ) : selected.uploadedVideoUrl ? (
                <video controls preload="metadata" poster={selected.posterImage?.src} className="max-h-[70vh] w-full bg-black">
                  <source src={selected.uploadedVideoUrl} />
                </video>
              ) : selected.videoUrl ? (
                <div className="flex min-h-[360px] items-center justify-center p-6 text-center">
                  <a href={selected.videoUrl} target="_blank" rel="noreferrer" className="border border-white/30 px-5 py-3 font-semibold hover:bg-white hover:text-[var(--school-blue-dark)]">
                    Open video
                  </a>
                </div>
              ) : null}
              {media.length > 1 ? (
                <>
                  <button type="button" onClick={() => openByIndex(selectedIndex - 1)} disabled={selectedIndex === 0} className="absolute left-3 top-1/2 -translate-y-1/2 border border-white/30 bg-black/40 px-3 py-2 text-sm font-semibold disabled:opacity-30">
                    Previous
                  </button>
                  <button type="button" onClick={() => openByIndex(selectedIndex + 1)} disabled={selectedIndex === media.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 border border-white/30 bg-black/40 px-3 py-2 text-sm font-semibold disabled:opacity-30">
                    Next
                  </button>
                </>
              ) : null}
            </div>
            {selected.caption || selected.transcript ? (
              <div className="px-4 py-4 text-sm leading-6 text-white/85">
                {selected.caption ? <p>{selected.caption}</p> : null}
                {selected.transcript ? <p className="mt-2">{selected.transcript}</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
